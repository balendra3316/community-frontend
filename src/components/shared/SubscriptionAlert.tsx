"use client";

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface SubscriptionAlertProps {
    isOpen: boolean;
    onClose: () => void;
}

const benefits = [
    "Log unlimited practice sessions",
    "Track your progress with detailed stats",
    "Maintain your practice streak",
    "Earn exclusive badges",
    " Make Posts daily"
];

export default function SubscriptionAlert({ isOpen, onClose }: SubscriptionAlertProps) {
    const router = useRouter();

    const handleSubscribeClick = () => {
        onClose(); // Close the modal first
        router.push('/subscribe'); // Then navigate to the subscribe page
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle className="font-bold text-center text-2xl text-gray-800">
                Unlock Your Full Potential
            </DialogTitle>
            <DialogContent>
                <DialogContentText className="text-center mb-4">
                    Subscribe to unlock this and all other premium features.
                </DialogContentText>
                <div className="space-y-2">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center">
                            <CheckCircleOutlineIcon color="primary" className="mr-2" />
                            <Typography variant="body1">{benefit}</Typography>
                        </div>
                    ))}
                </div>
            </DialogContent>
            <DialogActions className="p-4 flex flex-col sm:flex-row w-full">
                <Button onClick={onClose} color="secondary" className="w-full sm:w-auto mb-2 sm:mb-0">
                    Maybe Later
                </Button>
                <Button 
                    onClick={handleSubscribeClick} 
                    variant="contained" 
                    color="primary"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                    Subscribe Now
                </Button>
            </DialogActions>
        </Dialog>
    );
}