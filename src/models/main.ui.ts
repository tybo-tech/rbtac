export interface CTAAction {
  label: string;
  icon: string; // Font Awesome icon class
  href: string; // link/route
  variant?: 'primary' | 'accent'; // For color styling if needed
}
export interface WhyChooseUsItem {
  icon: string; // Font Awesome class, e.g., 'fa-bolt'
  title: string;
  description: string;
}
export interface Testimonial {
  name: string;
  role: string;
  company?: string;
  image: string; // Avatar image URL or path
  quote: string;
}

// FOOTER

// footer-link.model.ts (optional)
export interface FooterLink {
  label: string;
  href: string;
  icon?: string; // Optionally, add icons for footer links
}

export interface FooterContact {
  type: 'email' | 'phone' | 'address';
  value: string;
  icon: string;
}

export interface FooterSocial {
  icon: string; // e.g., 'fa-facebook-f'
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string; // Optionally, add icons for menu items
}
export interface INav {
  id: string;
  name: string;
  link: string;
  icon: string;
  roles: string[];
  children?: INav[];
}