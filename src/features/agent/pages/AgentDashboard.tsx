import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AgentLayout from "@/components/layout/AgentLayout";
import {
    WelcomeCardSkeleton,
    StatCardSkeleton,
    MatchCardSkeleton,
    EventListSkeleton,
} from "@/components/common/Skeleton";
import {
    mockAgentProfile,
    mockAgentStats,
    mockAssignedMatches,
    mockRecentEvents,
} from "@/data/agentMockData";

const AgentDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    // Get the live or next scheduled match
    const currentMatch = mockAssignedMatches[0]; // First match (live)
    const nextMatch = mockAssignedMatches.find((m) => m.status === "scheduled");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("en-NG", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getEventIcon = (type: string) => {
        const icons: Record<string, string> = {
            goal: "⚽",
            yellow_card: "🟨",
            red_card: "🟥",
            substitution: "🔄",
            foul: "⚠️",
            corner: "🚩",
        };
        return icons[type] || "📢";
    };

    return (
        <AgentLayout>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 py-6 md:py-8 lg:py-10 px-4 md:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl mx-auto space-y-6 md:space-y-8 lg:space-y-10"
                >
                    {/* Welcome Section */}
                    <motion.div variants={itemVariants}>
                        {isLoading ? (
                            <WelcomeCardSkeleton />
                        ) : (
                            <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl p-6 md:p-8 lg:p-10 shadow-lg overflow-hidden relative">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-10 right-10 w-40 h-40 rounded-full border-2 border-primary-foreground" />
                                </div>

                                <div className="relative z-10">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                                            Welcome back, {mockAgentProfile.name.split(" ")[0]}! 👋
                                        </h1>
                                        <p className="text-primary-foreground/80 text-sm md:text-base">
                                            {currentMatch.status === "live"
                                                ? `You're currently logging the match between ${currentMatch.homeTeam} and ${currentMatch.awayTeam}`
                                                : `Your next match is ${nextMatch?.homeTeam} vs ${nextMatch?.awayTeam} at ${nextMatch ? formatTime(nextMatch.startTime) : "N/A"}`}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-6 flex gap-3 flex-wrap"
                                    >
                                        {currentMatch.status === "live" && (
                                            <Button
                                                className="bg-accent hover:bg-accent/90 text-white font-semibold gap-2 text-sm md:text-base"
                                            >
                                                <Play className="w-4 h-4 md:w-5 md:h-5" />
                                                Continue Logging
                                            </Button>
                                        )}
                                        {nextMatch && currentMatch.status !== "live" && (
                                            <Button
                                                className="bg-accent hover:bg-accent/90 text-white font-semibold gap-2 text-sm md:text-base"
                                            >
                                                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                                                View Schedule
                                            </Button>
                                        )}
                                    </motion.div>
                                </div>
                            </Card>
                        )}
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {isLoading ? (
                            <>
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                                <StatCardSkeleton />
                            </>
                        ) : (
                            <>
                                <StatsCard
                                    label="Matches Logged"
                                    value={mockAgentStats.matchesLogged}
                                    icon="📊"
                                    delay={0.3}
                                />
                                <StatsCard
                                    label="Events Recorded"
                                    value={mockAgentStats.eventsRecorded}
                                    icon="📝"
                                    delay={0.4}
                                />
                                <StatsCard
                                    label="Accuracy Rate"
                                    value={`${mockAgentStats.accuracyRate}%`}
                                    icon="✅"
                                    delay={0.5}
                                />
                                <StatsCard
                                    label="This Month"
                                    value={`${mockAgentStats.monthlyPerformance}%`}
                                    icon="🎯"
                                    delay={0.6}
                                />
                            </>
                        )}
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Left Column - Match & Events */}
                        <div className="lg:col-span-2 space-y-6 md:space-y-8">
                            {/* Current/Featured Match */}
                            <motion.div variants={itemVariants}>
                                {isLoading ? (
                                    <MatchCardSkeleton />
                                ) : (
                                    <Card className="rounded-2xl p-6 md:p-8 shadow-lg border border-border overflow-hidden">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl md:text-2xl font-bold text-foreground">
                                                {currentMatch.status === "live" ? "🔴 Live Match" : "📅 Next Match"}
                                            </h2>
                                            <span className="px-3 py-1 bg-accent/10 text-accent text-xs md:text-sm font-semibold rounded-full">
                                                {currentMatch.status === "live" ? "LIVE" : "SCHEDULED"}
                                            </span>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Score Section */}
                                            <div className="flex items-center justify-between gap-4">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className="flex-1 text-center"
                                                >
                                                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                                        {currentMatch.homeTeam}
                                                    </div>
                                                    <div className="text-2xl md:text-3xl font-bold text-primary">
                                                        {currentMatch.homeScore ?? "-"}
                                                    </div>
                                                </motion.div>

                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="text-4xl md:text-5xl">
                                                        {currentMatch.homeTeamLogo}
                                                    </div>
                                                    <span className="text-xs md:text-sm text-muted-foreground font-semibold">
                                                        VS
                                                    </span>
                                                    <div className="text-4xl md:text-5xl">
                                                        {currentMatch.awayTeamLogo}
                                                    </div>
                                                </div>

                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className="flex-1 text-center"
                                                >
                                                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                                        {currentMatch.awayTeam}
                                                    </div>
                                                    <div className="text-2xl md:text-3xl font-bold text-primary">
                                                        {currentMatch.awayScore ?? "-"}
                                                    </div>
                                                </motion.div>
                                            </div>

                                            {/* Match Details */}
                                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border">
                                                <div>
                                                    <p className="text-xs md:text-sm text-muted-foreground mb-1">
                                                        Venue
                                                    </p>
                                                    <p className="text-sm md:text-base font-semibold text-foreground">
                                                        {currentMatch.venue}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs md:text-sm text-muted-foreground mb-1">
                                                        League
                                                    </p>
                                                    <p className="text-sm md:text-base font-semibold text-foreground">
                                                        {currentMatch.league}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {currentMatch.status === "live" && (
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 py-2.5 md:py-3">
                                                        <Play className="w-4 h-4 md:w-5 md:h-5" />
                                                        Log Event
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </Card>
                                )}
                            </motion.div>

                            {/* Recent Events */}
                            <motion.div variants={itemVariants}>
                                {isLoading ? (
                                    <EventListSkeleton />
                                ) : (
                                    <Card className="rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                                        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                                            Recent Events
                                        </h2>

                                        <div className="space-y-4">
                                            {mockRecentEvents.map((event, idx) => (
                                                <motion.div
                                                    key={event.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.5 + idx * 0.05 }}
                                                    className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                                                >
                                                    <span className="text-2xl flex-shrink-0">
                                                        {getEventIcon(event.type)}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm md:text-base font-semibold text-foreground">
                                                            {event.player}
                                                        </p>
                                                        <p className="text-xs md:text-sm text-muted-foreground">
                                                            {event.team} • Minute {event.minute}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground flex-shrink-0">
                                                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                                        {event.timestamp.toLocaleTimeString("en-NG", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </Card>
                                )}
                            </motion.div>
                        </div>

                        {/* Right Column - Quick Actions */}
                        <motion.div variants={itemVariants} className="space-y-6 md:space-y-8">
                            <Card className="rounded-2xl p-6 md:p-8 shadow-lg border border-border">
                                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
                                    Quick Actions
                                </h3>

                                <div className="space-y-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-4 py-3 md:py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm md:text-base hover:bg-primary/90 transition-colors flex items-center justify-between group"
                                    >
                                        <span>Start Match</span>
                                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-4 py-3 md:py-3.5 bg-secondary text-foreground rounded-lg font-semibold text-sm md:text-base hover:bg-secondary/80 transition-colors flex items-center justify-between group"
                                    >
                                        <span>View Calendar</span>
                                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-4 py-3 md:py-3.5 bg-secondary text-foreground rounded-lg font-semibold text-sm md:text-base hover:bg-secondary/80 transition-colors flex items-center justify-between group"
                                    >
                                        <span>Guidelines</span>
                                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </div>
                            </Card>

                            {/* Agent Info Card */}
                            {!isLoading && (
                                <Card className="rounded-2xl p-6 md:p-8 shadow-lg border border-border bg-gradient-to-br from-primary/5 to-accent/5">
                                    <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
                                        Agent Info
                                    </h3>

                                    <div className="space-y-3 text-sm md:text-base">
                                        <div>
                                            <p className="text-xs md:text-sm text-muted-foreground mb-1">
                                                Agent Code
                                            </p>
                                            <p className="font-semibold text-foreground">
                                                {mockAgentProfile.agentCode}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs md:text-sm text-muted-foreground mb-1">
                                                Status
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-success rounded-full" />
                                                <p className="font-semibold text-foreground capitalize">
                                                    {mockAgentProfile.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs md:text-sm text-muted-foreground mb-1">
                                                Member Since
                                            </p>
                                            <p className="font-semibold text-foreground">
                                                {mockAgentProfile.joinDate.toLocaleDateString("en-NG")}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AgentLayout>
    );
};

// Stats Card Component
const StatsCard = ({
    label,
    value,
    icon,
    delay,
}: {
    label: string;
    value: string | number;
    icon: string;
    delay: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ scale: 1.02, translateY: -5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-border overflow-hidden group cursor-pointer"
    >
        <div className="flex items-start justify-between mb-4">
            <h3 className="text-xs md:text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                {label}
            </h3>
            <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">
                {icon}
            </span>
        </div>
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            {value}
        </p>
        <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-4 origin-left"
        />
    </motion.div>
);

export default AgentDashboard;
