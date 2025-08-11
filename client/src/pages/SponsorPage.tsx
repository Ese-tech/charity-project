// client/src/pages/SponsorPage.tsx

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Link } from 'react-router-dom'; // <-- Import Link
import type { Child } from '../types/apiTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming you have these components

const SponsorPage: React.FC = () => {
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const availableChildren = await apiService.sponsorship.getAvailableChildren();
                setChildren(availableChildren);
            } catch (err) {
                console.error("Failed to fetch children:", err);
                setError("Failed to load children. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchChildren();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-gray-600">Loading children...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Sponsor a Child</h1>
            <p className="text-lg text-center text-gray-600 mb-12">
                Make a difference in a child's life by providing them with the support they need to thrive.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {children.map((child) => (
                    <Link to={`/children/${child._id}`} key={child._id}> {/* <-- Wrap the card in a Link */}
                        <Card className="w-full max-w-sm mx-auto transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105">
                            {child.photoUrl && (
                                <img src={child.photoUrl} alt={child.name} className="w-full h-64 object-cover rounded-t-lg" />
                            )}
                            <CardHeader>
                                <CardTitle>{child.name}, {child.age}</CardTitle>
                                <p className="text-sm text-gray-500">{child.country}</p>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4 flex-grow">{child.story}</p>
                                {/* The button is now inside the link */}
                                <div className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg text-center transition-all">
                                    View {child.name}'s Profile
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SponsorPage;