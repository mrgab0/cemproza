import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest dark:bg-on-background w-full py-stack-lg border-t border-surface-container-low dark:border-surface-dim mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter max-w-container-max mx-auto gap-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="CEMPROZA Cursos Logo" 
            className="w-12 h-12 rounded-full border border-black object-cover bg-white"
          />
          <span className="font-headline-lg text-headline-lg font-black text-on-surface dark:text-surface-bright">CEMPROZA Cursos</span>
        </div>
        
        {/* Copyright */}
        <p className="font-body-md text-body-md text-on-surface-variant text-center md:text-left">
          © {new Date().getFullYear()} CEMPROZA Cursos. Empowering the next generation of creators.
        </p>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-4">
          <Link href="#" className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary dark:text-primary-fixed-dim transition-all duration-300">Privacy Policy</Link>
          <Link href="#" className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary dark:text-primary-fixed-dim transition-all duration-300">Terms of Service</Link>
          <Link href="#" className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary dark:text-primary-fixed-dim transition-all duration-300">Help Center</Link>
          <Link href="#" className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:underline hover:text-primary dark:text-primary-fixed-dim transition-all duration-300">Contact Us</Link>
        </nav>
      </div>
    </footer>
  );
}
