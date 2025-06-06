"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Login submitted:", formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* <Link href="/">
                    <Button variant="ghost" className="mb-4 text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </Link> */}

                <Card className="border-0 shadow-2xl">
                    <CardHeader className="text-center pb-8">
                        <div className="mb-4">
                            <h1 className="text-3xl font-bold text-gray-900">EventFlow</h1>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-600">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-600">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="h-12 pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            <Link href="/user/dashboard">
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-black text-white hover:bg-secondary transition-all duration-200 text-lg cursor-pointer"
                                >
                                    Sign In
                                </Button>
                            </Link>
                        </form>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}