export interface Album {
    id: string;
    title: string;
    artist: string;
    genre: string;
    release_year: number;
}

// Extend the built-in NextAuth types
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

