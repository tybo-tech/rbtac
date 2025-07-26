
export interface Users {
  user_id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  metadata?: {
    token?: string;
    subscription?: any;
    source: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    email_verified?: boolean;
  };
  website_id: number;
  confirmed: number;
  created_at: string;
  updated_at: string;
  slug: string;
}

export const initUsers: Users = {
  user_id: 0,
  name: '',
  email: '',
  password: '',
  role: 'admin',
  metadata: {
    source: 'site',
  },
  website_id: 0,
  confirmed: 0,
  created_at: '',
  updated_at: '',
  slug: '',
};



export interface GoogleUser {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}



export function googleToUser(googleUser: GoogleUser): Users {
  return {
    user_id: 0,
    name: googleUser.name,
    email: googleUser.email,
    password: '',
    role: '',
    metadata: {
      picture: googleUser.picture,
      given_name: googleUser.given_name,
      family_name: googleUser.family_name,
      email_verified: googleUser.email_verified,
      source: 'google',
    },
    website_id: 0,
    confirmed: 0,
    created_at: '',
    updated_at: '',
    slug: '',
  };
}