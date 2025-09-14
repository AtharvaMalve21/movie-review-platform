import React from 'react';
import { Film } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <Film className="h-8 w-8 text-blue-400" />
                            <span className="text-xl font-bold">MovieReview</span>
                        </div>
                        <p className="text-gray-400 max-w-md">
                            Discover, review, and discuss your favorite movies with fellow film enthusiasts.
                            Join our community of movie lovers today!
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
                            <li><a href="/movies" className="text-gray-400 hover:text-white">Movies</a></li>
                            <li><a href="/login" className="text-gray-400 hover:text-white">Login</a></li>
                            <li><a href="/register" className="text-gray-400 hover:text-white">Register</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 MovieReview Platform. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
