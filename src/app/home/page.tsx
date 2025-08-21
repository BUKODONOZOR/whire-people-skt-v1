/**
 * Home Landing Page - Wired People
 * Clean, spacious landing page without sidebar
 */

"use client";

import { useRouter } from "next/navigation";
import { WiredPeopleLogo } from "@/shared/components/ui/logos";
import { 
  Users, 
  Shield, 
  Zap,
  Heart,
  Target,
  Trophy,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award,
  Briefcase,
  Globe,
  Building,
  UserCheck,
  BarChart3,
  Clock,
  Star,
  ChevronRight,
  Search,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { value: "500+", label: "Verified Professionals", icon: UserCheck },
    { value: "95%", label: "Placement Success Rate", icon: Trophy },
    { value: "48h", label: "Average Match Time", icon: Clock },
    { value: "100+", label: "Partner Organizations", icon: Building }
  ];

  const specializations = [
    {
      id: "health",
      title: "Public Health",
      description: "Epidemiologists, health policy experts, and public health program managers ready to tackle health challenges.",
      icon: Heart,
      color: "#75A3AB",
      features: ["Epidemiologists", "Health Policy Experts", "Program Managers"]
    },
    {
      id: "it",
      title: "Information Technology",
      description: "Full-stack developers, cloud architects, and DevOps engineers to power your digital transformation.",
      icon: Users,
      color: "#0D6661",
      features: ["Software Engineers", "Cloud Architects", "DevOps Engineers"]
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      description: "Security analysts, penetration testers, and compliance specialists to protect your digital assets.",
      icon: Shield,
      color: "#FC7E00",
      features: ["Security Analysts", "Penetration Testers", "Compliance Specialists"]
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/talent?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <WiredPeopleLogo size="lg" />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/talent" className="text-gray-600 hover:text-[#0D6661] font-medium transition-colors">
                Talent Pool
              </Link>
              <Link href="/processes" className="text-gray-600 hover:text-[#0D6661] font-medium transition-colors">
                Processes
              </Link>
              <Link href="/" className="text-gray-600 hover:text-[#0D6661] font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/metrics" className="text-gray-600 hover:text-[#0D6661] font-medium transition-colors">
                Analytics
              </Link>
              <button 
                onClick={() => router.push('/talent')}
                className="px-6 py-2 bg-[#0D6661] text-white font-medium rounded-lg hover:bg-[#164643] transition-colors"
              >
                Get Started
              </button>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/talent" className="block px-3 py-2 text-gray-600 hover:text-[#0D6661] font-medium">
                Talent Pool
              </Link>
              <Link href="/processes" className="block px-3 py-2 text-gray-600 hover:text-[#0D6661] font-medium">
                Processes
              </Link>
              <Link href="/" className="block px-3 py-2 text-gray-600 hover:text-[#0D6661] font-medium">
                Dashboard
              </Link>
              <Link href="/metrics" className="block px-3 py-2 text-gray-600 hover:text-[#0D6661] font-medium">
                Analytics
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CFE8E0] rounded-full mb-8">
              <TrendingUp className="w-4 h-4 text-[#0D6661]" />
              <span className="text-sm font-medium text-[#0D6661]">Smart Talent Procurement Solutions</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-[#164643] mb-6">
              Build Your Team Faster
              <br />
              <span className="text-[#0D6661]">with Wired People</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Connect with pre-vetted professionals in Public Health, IT, and Cybersecurity. 
              Our talent pool is ready to contribute to your organization's success.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for React Developer, Cybersecurity Expert, Public Health Specialist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D6661] focus:border-transparent text-lg"
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="px-8 py-4 bg-[#0D6661] text-white font-semibold rounded-lg hover:bg-[#164643] transition-all flex items-center gap-2"
                >
                  Find Talent
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={() => router.push('/talent')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0D6661] font-medium rounded-lg border-2 border-[#0D6661] hover:bg-[#F4FDF9] transition-all"
              >
                <Building className="w-5 h-5" />
                For Companies
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-[#0D6661] mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#164643] mb-4">
              Our Specializations
            </h2>
            <p className="text-xl text-gray-600">
              We connect organizations with top talent in critical sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specializations.map((spec) => {
              const Icon = spec.icon;
              return (
                <div 
                  key={spec.id}
                  className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-lg mb-6"
                    style={{ backgroundColor: `${spec.color}15` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: spec.color }} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#164643] mb-3">
                    {spec.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {spec.description}
                  </p>
                  
                  <div className="space-y-2">
                    {spec.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle 
                          className="w-4 h-4 flex-shrink-0" 
                          style={{ color: spec.color }}
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0D6661]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Dream Team?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of organizations that trust Wired People for their talent needs.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => router.push('/talent')}
              className="px-8 py-4 bg-white text-[#0D6661] font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              Browse Talent →
            </button>
            <button 
              onClick={() => window.location.href = 'mailto:contact@wiredpeople.com'}
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <WiredPeopleLogo size="md" />
              <span className="text-gray-600">© 2025 Wired People. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-[#0D6661] transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-[#0D6661] transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-[#0D6661] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
