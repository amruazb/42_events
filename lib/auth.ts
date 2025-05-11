import type { NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"
import FortyTwoProvider from "next-auth/providers/42-school"
import dbConnect from "@/lib/db"
import User from "@/lib/models/user"

// Function to refresh the 42 API token
async function refreshAccessToken(token: JWT) {
  try {
    const response = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        refresh_token: token.refreshToken as string,
        client_id: process.env.FORTYTWO_CLIENT_ID as string,
        client_secret: process.env.FORTYTWO_CLIENT_SECRET as string,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
    }
  } catch (error) {
    console.error("Error refreshing access token", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    FortyTwoProvider({
      clientId: process.env.FORTYTWO_CLIENT_ID as string,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Initial sign in
      if (account && profile) {
        const db = await dbConnect()

        // If database connection is available, update user info
        if (db) {
          try {
            // Find or create user in database
            const existingUser = await User.findOne({ fortytwoId: profile.id })

            if (existingUser) {
              // Update user information
              existingUser.accessToken = account.access_token as string
              existingUser.refreshToken = account.refresh_token as string
              existingUser.tokenExpiry = new Date(Date.now() + (account.expires_in as number) * 1000)
              existingUser.lastLogin = new Date()
              await existingUser.save()
            } else {
              // Create new user
              await User.create({
                fortytwoId: profile.id,
                email: profile.email,
                username: profile.login,
                displayName: profile.displayname || profile.login,
                avatar: profile.image.link,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                tokenExpiry: new Date(Date.now() + (account.expires_in as number) * 1000),
                lastLogin: new Date(),
                // Set first user as admin or use an admin list
                isAdmin: (await User.countDocuments({})) === 0,
              })
            }
          } catch (error) {
            console.error("Error updating user in database:", error)
          }
        } else {
          console.warn("Database connection not available. User will not be saved to database.")
        }

        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: Date.now() + (account.expires_in as number) * 1000,
          user: {
            id: profile.id,
            email: profile.email,
            name: profile.displayname || profile.login,
            image: profile.image.link,
          },
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to refresh it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string
        session.error = token.error as string

        if (token.user) {
          session.user = token.user as any
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to admin dashboard after login
      return `${baseUrl}/admin`
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
