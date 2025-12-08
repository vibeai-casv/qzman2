import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    BrainCircuit,
    Users,
    ChevronRight,
    Play,
    Menu,
    X,
    Monitor,
    BarChart3
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import AnimatedBackground from '../components/ui/AnimatedBackground';

// --- Components ---

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md py-6 shadow-lg border-b border-qz-primary/20' : 'bg-transparent py-8'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-qz-primary to-qz-secondary flex items-center justify-center shadow-lg shadow-qz-primary/30">
                        <BrainCircuit className="text-white" size={32} />
                    </div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-qz-primary to-qz-accent bg-clip-text text-transparent tracking-tight">QZMAN</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    {['Home', 'Features', 'Quizzes', 'Stats', 'Contact'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-300 hover:text-white font-semibold transition-colors text-lg tracking-wide hover:scale-105 transform duration-200">
                            {item}
                        </a>
                    ))}
                    <div className="h-8 w-px bg-slate-700 mx-4"></div>
                    <Button
                        onClick={() => navigate('/login')}
                        variant="ghost"
                        size="lg"
                        className="text-white hover:text-qz-accent text-lg font-medium"
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() => navigate('/play')}
                        className="bg-gradient-to-r from-qz-primary to-qz-accent hover:opacity-90 text-white rounded-full px-8 py-6 text-lg font-bold shadow-xl shadow-qz-primary/20 hover:scale-105 transition-transform"
                    >
                        Join Quiz
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden text-white cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-t border-slate-800 absolute w-full"
                    >
                        <div className="flex flex-col p-8 gap-6">
                            {['Home', 'Features', 'Quizzes', 'Stats', 'Contact'].map((item) => (
                                <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-300 hover:text-white font-bold text-xl" onClick={() => setMobileMenuOpen(false)}>
                                    {item}
                                </a>
                            ))}
                            <div className="flex gap-4 mt-4">
                                <Button onClick={() => navigate('/login')} variant="outline" className="flex-1 py-4 text-lg border-qz-primary/50 text-qz-primary">Login</Button>
                                <Button onClick={() => navigate('/play')} className="flex-1 bg-gradient-to-r from-qz-primary to-qz-accent text-white py-4 text-lg">Join Quiz</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const Hero = () => {
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background elements moved to AnimatedBackground component, but keep specific image overlay */}
            <div className="absolute inset-0 bg-[url('/images/hero_bg.png')] bg-cover bg-center opacity-20 mix-blend-overlay z-0"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-qz-primary/10 border border-qz-primary/20 text-qz-primary font-bold text-sm tracking-wider mb-6 backdrop-blur-sm">
                                NEXT-GEN QUIZ MANAGEMENT
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                                Engage Audience with<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-qz-primary to-qz-accent">Live Quizzes</span>
                            </h1>
                            <p className="text-lg text-slate-300 mt-6 max-w-xl leading-relaxed">
                                QZMAN is the ultimate platform for hosting engaging quizzes.
                                From AI-generated questions to real-time leaderboards, we power competitive learning.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Button className="h-14 px-8 rounded-full bg-gradient-to-r from-qz-primary to-qz-secondary hover:opacity-90 text-white text-lg font-semibold shadow-xl shadow-qz-primary/30 transition-all hover:scale-105">
                                Start Hosting
                            </Button>
                            <Button variant="outline" className="h-14 px-8 rounded-full border-slate-700 hover:bg-slate-800/80 backdrop-blur-sm text-white text-lg font-medium">
                                <Play className="mr-2 w-5 h-5 fill-current" /> How it Works?
                            </Button>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-qz-primary/20 backdrop-blur-sm group">
                                <img src="/images/hero_feature.png" alt="Live Quiz Event" className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                                        <div>
                                            <p className="text-qz-accent font-semibold text-sm">Live Now</p>
                                            <h3 className="text-white font-bold text-xl">Tech Trivia Championship</h3>
                                        </div>
                                        <div className="bg-qz-danger rounded-full w-12 h-12 flex items-center justify-center animate-pulse">
                                            <span className="font-bold text-white">LIVE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-12 -right-12 bg-slate-800/90 backdrop-blur-md p-4 rounded-2xl border border-qz-success/20 shadow-xl hidden lg:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-qz-success/20 rounded-full flex items-center justify-center">
                                    <Users className="text-qz-success" size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Active Players</p>
                                    <p className="text-lg font-bold text-white">1,240+</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ServiceCard = ({ icon: Icon, title, description }: any) => (
    <motion.div
        whileHover={{ y: -10 }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative bg-slate-900/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 hover:border-qz-primary/50 transition-all duration-300 shadow-lg hover:shadow-qz-primary/10"
    >
        <div className="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
            <Icon size={120} />
        </div>

        <div className="p-8 relative z-10">
            <div className="w-14 h-14 bg-slate-800/80 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-qz-primary transition-colors duration-300">
                <Icon size={28} className="text-qz-primary group-hover:text-white transition-colors" />
            </div>

            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-qz-accent transition-colors">{title}</h3>
            <p className="text-slate-400 mb-6 line-clamp-2">{description}</p>

            <div className="flex items-center text-sm font-semibold text-white group-hover:text-qz-primary cursor-pointer">
                <span>Explore Feature</span>
                <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
        <div className="h-1 w-0 bg-gradient-to-r from-qz-primary to-qz-accent group-hover:w-full transition-all duration-500"></div>
    </motion.div>
);

const Features = () => {
    return (
        <section id="features" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-20">
                    <ServiceCard
                        icon={BrainCircuit}
                        title="AI Generated Questions"
                        description="Generate limitless questions on any topic instantly using our advanced AI integration. No more manual data entry."
                    />
                    <ServiceCard
                        icon={Monitor}
                        title="Live Projector View"
                        description="Display questions and real-time scores on the big screen with our dedicated projector mode for events."
                    />
                    <ServiceCard
                        icon={BarChart3}
                        title="Real-time Analytics"
                        description="Track team performance, question difficulty, and engagement levels with comprehensive analytics dashboards."
                    />
                </div>
            </div>
        </section>
    );
};

const About = () => {
    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    <div className="lg:w-1/2">
                        <div className="space-y-4">
                            {[
                                { q: "How do I create a quiz?", a: "Simply log in as an Admin, go to 'Quizzes', and click 'Create'. You can add questions manually or use AI generation." },
                                { q: "Can teams join remotely?", a: "Yes! Teams can join from any device using the 'Join Quiz' code provided by the Quiz Master." },
                                { q: "Is it suitable for large events?", a: "Absolutely. QzMan is built to handle multiple teams and massive question banks with zero latency." },
                                { q: "How does scoring work?", a: "Scores are updated automatically in real-time. Score Managers can also manually adjust points for bonus rounds." }
                            ].map((item, idx) => (
                                <details key={idx} className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/5 open:border-qz-primary/50 open:bg-slate-800/80 transition-all duration-300">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-qz-primary transition-colors">{item.q}</h3>
                                        <span className="text-slate-500 group-open:rotate-180 transition-transform duration-300">
                                            <ChevronRight />
                                        </span>
                                    </summary>
                                    <div className="px-6 pb-6 text-slate-400 leading-relaxed">
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                    <div className="lg:w-1/2 lg:sticky lg:top-32">
                        <span className="text-qz-primary font-bold tracking-wider text-sm uppercase mb-2 block">About QZMAN</span>
                        <h2 className="text-4xl font-bold text-white mb-6 leading-tight">What makes us the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-qz-primary to-qz-accent">best quiz platform?</span></h2>
                        <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                            We don't just ask questions; we create experiences. Whether it's a corporate event, a school competition, or a casual trivia night, QzMan provides the tools to run it smoothly.
                        </p>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-1">1k+</h4>
                                <p className="text-sm text-slate-500">Quizzes Hosted</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-1">50k+</h4>
                                <p className="text-sm text-slate-500">Questions Bank</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-1">100+</h4>
                                <p className="text-sm text-slate-500">Active Organizations</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-white mb-1">99.9%</h4>
                                <p className="text-sm text-slate-500">Uptime Reliability</p>
                            </div>
                        </div>
                        <Button className="bg-gradient-to-r from-qz-primary to-qz-secondary text-white rounded-full px-8 py-6 text-lg hover:shadow-lg hover:shadow-qz-primary/20">Explore Features</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

const QuizCard = ({ title, category, status, players, img }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 group hover:border-qz-primary/50 hover:shadow-2xl hover:shadow-qz-primary/10 transition-all duration-300"
    >
        <div className="relative h-48 overflow-hidden">
            <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white uppercase tracking-wider">
                {category}
            </div>
            <div className="absolute top-4 right-4 bg-qz-primary px-3 py-1 rounded-lg text-xs font-bold text-white">
                {status}
            </div>
        </div>
        <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center">
                    <Users size={14} className="text-slate-400" />
                </div>
                <span className="text-sm text-slate-400">{players} Teams Registered</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-qz-accent transition-colors">{title}</h3>
            <p className="text-slate-500 text-sm mb-4">Compete in this challenge to top the global leaderboard.</p>
        </div>
    </motion.div>
);

const PopularQuizzes = () => {
    return (
        <section id="quizzes" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-qz-primary font-bold tracking-wider text-sm uppercase">Active Challenges</span>
                    <h2 className="text-4xl font-bold text-white mt-2">Join Popular Quizzes</h2>
                </div>

                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    {['Show All', 'Technology', 'Science', 'General Knowledge'].map((filter, idx) => (
                        <button key={filter} className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${idx === 0 ? 'bg-qz-primary text-white' : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800/80'}`}>
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <QuizCard title="Full Stack Trivia" category="Technology" status="LIVE" players="12" img="/images/quiz_tech.png" />
                    <QuizCard title="Cosmic Science" category="Science" status="UPCOMING" players="45" img="/images/quiz_science.png" />
                    <QuizCard title="World History 2024" category="General Knowledge" status="OPEN" players="8" img="/images/quiz_history.png" />
                    <QuizCard title="Pop Culture Blast" category="Entertainment" status="LIVE" players="24" img="/images/quiz_pop.png" />
                </div>
            </div>
        </section>
    );
};

const Contact = () => {
    return (
        <section id="contact" className="py-24 relative">
            <div className="container mx-auto px-6">
                <div className="bg-gradient-to-br from-qz-primary/10 to-qz-secondary/10 backdrop-blur-xl rounded-3xl p-8 lg:p-16 overflow-hidden relative border border-white/10">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-qz-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-qz-accent/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                        <div className="lg:w-1/2">
                            <span className="text-qz-primary font-bold tracking-wider text-sm uppercase mb-2 block">Contact Us</span>
                            <h2 className="text-4xl font-bold text-white mb-6">Want to Host a Quiz?</h2>
                            <p className="text-indigo-100/80 text-lg mb-8 leading-relaxed">
                                Get in touch with us to set up a managed quiz event for your organization. We offer custom branding and dedicated support.
                            </p>
                            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl inline-block border border-white/10">
                                <span className="text-qz-success uppercase text-xs font-bold tracking-widest mb-1 block">Enterprise Plan</span>
                                <div className="text-3xl font-bold text-white">Scale Up</div>
                                <div className="text-sm text-indigo-200 mt-1">Unlimited participants & custom domains</div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 bg-slate-900/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                            <form className="space-y-4">
                                <input type="text" placeholder="Organization Name..." className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-qz-primary transition-colors" />
                                <input type="email" placeholder="Your E-mail..." className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-qz-primary transition-colors" />
                                <textarea placeholder="Describe your event requirements..." rows={4} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-qz-primary transition-colors"></textarea>
                                <Button className="w-full bg-gradient-to-r from-qz-primary to-qz-accent hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg shadow-qz-primary/25">
                                    Send Inquiry
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => (
    <footer className="bg-slate-950/90 backdrop-blur-sm py-12 border-t border-slate-900 text-center text-slate-500 text-sm relative z-10">
        <div className="container mx-auto px-6">
            <p className="mb-4">Copyright © 2024 QzMan Platform. All rights reserved.</p>
            <div className="flex justify-center gap-6">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
        </div>
    </footer>
);


export default function LandingPage() {
    return (
        <div className="font-sans text-slate-200 bg-slate-950 min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200 relative">
            <AnimatedBackground />
            <Navbar />
            <Hero />
            <Features />
            <About />
            <PopularQuizzes />
            <Contact />
            <Footer />
        </div>
    );
}

