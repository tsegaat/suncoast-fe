import React from "react";
import { motion } from "framer-motion";
import Lottie from "react-lottie-player";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { ArrowRight, CheckCircle, Shield, Zap } from "lucide-react";

// Import Lottie animations
import taskManagementAnimation from "../assets/lottie/task-management.json";
import productivityAnimation from "../assets/lottie/productivity.json";
import securityAnimation from "../assets/lottie/security.json";

// Custom components to replace shadcn/ui components
const Button: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        size?: "default" | "lg" | "sm";
        variant?: "default" | "secondary";
    }
> = ({
    children,
    className,
    size = "default",
    variant = "default",
    ...props
}) => {
    const sizeClasses = {
        default: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
        sm: "px-2 py-1 text-sm",
    };
    const variantClasses = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-white text-blue-800 hover:bg-blue-100",
    };
    return (
        <button
            className={`rounded-md font-medium transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div className={`bg-white rounded-lg shadow-md ${className}`} {...props}>
        {children}
    </div>
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div className={`p-6 ${className}`} {...props}>
        {children}
    </div>
);

const Carousel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div className={`relative ${className}`} {...props}>
        {children}
    </div>
);

const CarouselContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div
        className={`flex overflow-x-auto snap-x snap-mandatory ${className}`}
        {...props}
    >
        {children}
    </div>
);

const CarouselItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => (
    <div className={`flex-shrink-0 w-full snap-center ${className}`} {...props}>
        {children}
    </div>
);

const CarouselPrevious: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => (
    <button
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        {...props}
    >
        <ArrowRight className="w-6 h-6 transform rotate-180" />
    </button>
);

const CarouselNext: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
    props
) => (
    <button
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
        {...props}
    >
        <ArrowRight className="w-6 h-6" />
    </button>
);

const productivityData = [
    { name: "Week 1", withoutTaskCurator: 65, withTaskCurator: 80 },
    { name: "Week 2", withoutTaskCurator: 68, withTaskCurator: 85 },
    { name: "Week 3", withoutTaskCurator: 70, withTaskCurator: 90 },
    { name: "Week 4", withoutTaskCurator: 72, withTaskCurator: 95 },
];

const testimonials = [
    {
        name: "John Doe",
        role: "CEO, TechCorp",
        text: "Task Curator has revolutionized our workflow. It's intuitive, powerful, and has significantly boosted our productivity.",
    },
    {
        name: "Jane Smith",
        role: "Operations Manager, GlobalTech",
        text: "The role-based system is a game-changer. It's made task delegation and tracking so much easier across our organization.",
    },
    {
        name: "Mike Johnson",
        role: "Team Lead, InnovateCo",
        text: "The real-time insights have helped us identify bottlenecks and optimize our processes. Highly recommended!",
    },
];

export default function TaskCuratorLandingPage() {
    return (
        <div className="min-h-screen bg-white text-blue-900">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-blue-50">
                <div className="absolute inset-0 z-0">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-100 to-blue-200 opacity-50"
                        initial={{ scale: 1.2, rotate: -5 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold mb-4 text-blue-900"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        Elevate Task Management Across Your Organization
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl mb-8 text-blue-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    >
                        Effortlessly create, assign, and track tasks with robust
                        role-based control and real-time insights.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                    >
                        <Button size="lg">
                            Get Started for Free{" "}
                            <ArrowRight className="ml-2 inline" />
                        </Button>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <Lottie
                        loop
                        animationData={taskManagementAnimation}
                        play
                        style={{ width: "100%", height: "300px" }}
                    />
                </div>
            </section>

            {/* Dynamic Graphs & Metrics */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
                        Boost Your Productivity
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent>
                                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                                    Productivity Increase
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={productivityData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#ccc"
                                        />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#1e40af"
                                        />
                                        <YAxis stroke="#1e40af" />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="withoutTaskCurator"
                                            stroke="#3b82f6"
                                            name="Without Task Curator"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="withTaskCurator"
                                            stroke="#1d4ed8"
                                            name="With Task Curator"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <div className="flex flex-col justify-center">
                            <motion.div
                                className="mb-8"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-2xl font-semibold mb-2 text-blue-800">
                                    30% Reduction in Task Overhead
                                </h3>
                                <p className="text-blue-700">
                                    Streamline your workflow and eliminate
                                    unnecessary steps.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-2xl font-semibold mb-2 text-blue-800">
                                    40% Increase in Task Completion Rates
                                </h3>
                                <p className="text-blue-700">
                                    Empower your team to accomplish more in less
                                    time.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role-Based Insights */}
            <section className="py-20 bg-blue-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
                        Tailored for Every Role
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Super Admin",
                                icon: Shield,
                                description:
                                    "Create companies, manage admins, and oversee global operations.",
                            },
                            {
                                title: "Admin",
                                icon: Zap,
                                description:
                                    "Assign tasks, track progress, and manage team performance.",
                            },
                            {
                                title: "Employee",
                                icon: CheckCircle,
                                description:
                                    "Receive tasks, update progress, and collaborate efficiently.",
                            },
                        ].map((role, index) => (
                            <motion.div
                                key={role.title}
                                className="text-center bg-white p-6 rounded-lg shadow-md"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}
                                viewport={{ once: true }}
                            >
                                <role.icon className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                                <h3 className="text-xl font-semibold mb-2 text-blue-800">
                                    {role.title}
                                </h3>
                                <p className="text-blue-700">
                                    {role.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Demo */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
                        See Task Curator in Action
                    </h2>
                    <div className="relative aspect-video max-w-4xl mx-auto">
                        <Lottie
                            loop
                            animationData={productivityAnimation}
                            play
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                </div>
            </section>

            {/* Security & Scalability */}
            <section className="py-20 bg-blue-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
                        Enterprise-Grade Security & Scalability
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="bg-white border-blue-200">
                            <CardContent>
                                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                                    Robust Architecture
                                </h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
                                        <span className="text-blue-700">
                                            AWS Cognito for secure
                                            authentication
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
                                        <span className="text-blue-700">
                                            FastAPI for high-performance backend
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
                                        <span className="text-blue-700">
                                            Serverless infrastructure for
                                            optimal scaling
                                        </span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-blue-200">
                            <CardContent>
                                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                                    Scalability
                                </h3>
                                <p className="text-blue-700">
                                    Task Curator is designed to grow with your
                                    organization. Whether you're a startup or a
                                    large enterprise, our platform ensures
                                    smooth performance and reliability at any
                                    scale.
                                </p>
                                <div className="mt-4">
                                    <Lottie
                                        loop
                                        animationData={securityAnimation}
                                        play
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 text-blue-900">
                        What Our Customers Say
                    </h2>
                    <Carousel className="max-w-4xl mx-auto">
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index}>
                                    <Card className="bg-blue-50 border-blue-200">
                                        <CardContent className="text-center">
                                            <p className="text-lg mb-4 text-blue-700">
                                                "{testimonial.text}"
                                            </p>
                                            <p className="font-semibold text-blue-800">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-sm text-blue-600">
                                                {testimonial.role}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </section>

            {/* Footer */}
            <section>
                <footer className="bg-blue-900 text-white py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">
                                    Task Curator
                                </h3>
                                <p>Elevate your task management game.</p>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Quick Links
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="hover:underline">
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline">
                                            Features
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline">
                                            Pricing
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline">
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Legal
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="hover:underline">
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline">
                                            Terms of Service
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline">
                                            Cookie Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold mb-4">
                                    Connect
                                </h4>
                                <div className="flex space-x-4">
                                    <a href="#" className="hover:text-blue-300">
                                        <svg
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                    <a href="#" className="hover:text-blue-300">
                                        <svg
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>
                                    <a href="#" className="hover:text-blue-300">
                                        <svg
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-blue-800 text-center">
                            <p>
                                &copy; {new Date().getFullYear()} Task Curator.
                                All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to streamline your tasks?
                    </h2>
                    <p className="text-xl mb-8">
                        Experience the power of Task Curator today.
                    </p>
                    <Button size="lg" variant="secondary">
                        Try Task Curator Now
                    </Button>
                </div>
            </section>
        </div>
    );
}
