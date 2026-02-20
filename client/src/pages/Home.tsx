import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGenerateIdea, type IdeaResult } from "@/hooks/use-ideas";
import { InsertProjectIdea, insertProjectIdeaSchema } from "@shared/schema";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Loader2,
  Download,
  Copy,
  RefreshCcw,
  BookOpen,
  Users,
  Target,
  BrainCircuit,
  Lightbulb,
  CheckCircle2,
  FileText,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const DOMAINS = [
  "Artificial Intelligence", "Machine Learning", "Deep Learning", "Data Science",
  "Web Development", "Full Stack Development", "Python Development", "Java Development",
  "Mobile App Development", "Android Development", "iOS Development", "Internet of Things (IoT)",
  "Blockchain", "Cybersecurity", "Cloud Computing", "DevOps", "AR/VR", "Game Development",
  "Big Data", "NLP", "Computer Vision", "Robotics", "Embedded Systems", "FinTech",
  "HealthTech", "EdTech", "E-commerce Systems", "Networking", "Automation Systems", "Software Testing"
];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const TEAM_SIZES = ["1", "2", "3", "4", "5"];
const TIME_LIMITS = ["2 weeks", "1 month", "2 months", "3 months"];
const STRICTNESS_LEVELS = ["Low", "Medium", "High"];
const PROJECT_TYPES = ["Mini Project", "Major Project"];
const COMPLEXITY_LEVELS = ["Simple", "Moderate", "Innovative"];

export default function Home() {
  const [result, setResult] = useState<IdeaResult | null>(null);
  const { mutate: generateIdea, isPending } = useGenerateIdea();
  const { toast } = useToast();

  const form = useForm<InsertProjectIdea>({
    resolver: zodResolver(insertProjectIdeaSchema),
    defaultValues: {
      teamSize: 1, // Default value as number
    },
  });

  const onSubmit = (data: InsertProjectIdea) => {
    // Ensure teamSize is treated as number (though schema handles validation)
    const payload = { ...data, teamSize: Number(data.teamSize) };
    
    generateIdea(payload, {
      onSuccess: (data) => {
        setResult(data.result as unknown as IdeaResult);
        // Scroll to results
        setTimeout(() => {
          document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
    });
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `
Project: ${result.project_title}
Problem: ${result.problem_statement}
Solution: ${result.solution_overview}
    `.trim();
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Project summary copied to clipboard." });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground pb-20">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 ring-1 ring-primary/20">
              <BrainCircuit className="w-8 h-8 text-primary mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight">
                AI Project <span className="text-gradient">Generator</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
              Generate unique, tailored project ideas for your final year submission. 
              Powered by advanced AI to match your exact constraints.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form */}
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card border-none overflow-hidden h-full">
              <div className="bg-primary/10 p-4 border-b border-white/5 flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg">Project Parameters</h2>
              </div>
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <SelectField
                      control={form.control}
                      name="domain"
                      label="Domain of Interest"
                      placeholder="Select a domain..."
                      options={DOMAINS}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField
                        control={form.control}
                        name="skillLevel"
                        label="Skill Level"
                        placeholder="Select level"
                        options={SKILL_LEVELS}
                      />
                      <FormField
                         control={form.control}
                         name="teamSize"
                         render={({ field }) => (
                           <FormItem>
                             <FormLabel className="text-muted-foreground font-medium">Team Size</FormLabel>
                             <Select 
                               onValueChange={(val) => field.onChange(parseInt(val))} 
                               defaultValue={field.value?.toString()}
                             >
                               <FormControl>
                                 <SelectTrigger className="bg-background/50 border-white/10 h-12 rounded-xl">
                                   <SelectValue placeholder="Size" />
                                 </SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                 {TEAM_SIZES.map(s => <SelectItem key={s} value={s}>{s} Members</SelectItem>)}
                               </SelectContent>
                             </Select>
                           </FormItem>
                         )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <SelectField
                        control={form.control}
                        name="timeLimit"
                        label="Time Limit"
                        placeholder="Duration"
                        options={TIME_LIMITS}
                      />
                      <SelectField
                        control={form.control}
                        name="strictnessLevel"
                        label="Strictness"
                        placeholder="Evaluation"
                        options={STRICTNESS_LEVELS}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <SelectField
                        control={form.control}
                        name="projectType"
                        label="Type"
                        placeholder="Select type"
                        options={PROJECT_TYPES}
                      />
                      <SelectField
                        control={form.control}
                        name="complexity"
                        label="Complexity"
                        placeholder="Preference"
                        options={COMPLEXITY_LEVELS}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 mt-6 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Idea...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          Generate Project Idea
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Area */}
          <div className="lg:col-span-7" id="results-section">
            <AnimatePresence mode="wait">
              {!result && !isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/5"
                >
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-float">
                    <Lightbulb className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Ready to Innovate?</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Fill in your preferences on the left and let our AI craft the perfect project proposal for you.
                  </p>
                </motion.div>
              )}

              {isPending && !result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 rounded-3xl bg-card/30 backdrop-blur-sm border border-white/5"
                >
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Analyzing Constraints...</h3>
                  <p className="text-muted-foreground">Synthesizing project possibilities based on your skill level.</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                >
                  <Card className="glass-card border-primary/20 overflow-hidden shadow-2xl shadow-black/40">
                    <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 p-6 border-b border-white/10 flex justify-between items-start">
                      <div>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="outline" className="bg-black/20 border-primary/50 text-primary-foreground backdrop-blur-md">
                            {result.difficulty} Difficulty
                          </Badge>
                          <Badge variant="secondary" className="bg-secondary/80">
                            Acceptance: {result.faculty_acceptance_chance}
                          </Badge>
                        </div>
                        <h2 className="text-3xl font-bold font-display leading-tight">{result.project_title}</h2>
                      </div>
                      <div className="flex gap-2">
                         <Button size="icon" variant="ghost" onClick={copyToClipboard} title="Copy Summary">
                           <Copy className="w-5 h-5" />
                         </Button>
                         <Button size="icon" variant="ghost" onClick={handlePrint} title="Download PDF">
                           <Download className="w-5 h-5" />
                         </Button>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-8">
                      {/* Problem & Solution */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                            <HelpCircle className="w-5 h-5" /> Problem Statement
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed bg-black/20 p-4 rounded-xl">
                            {result.problem_statement}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                            <Lightbulb className="w-5 h-5" /> Solution Overview
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed bg-black/20 p-4 rounded-xl">
                            {result.solution_overview}
                          </p>
                        </div>
                      </div>

                      <Separator className="bg-white/10" />

                      {/* Tech Stack & Features */}
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" /> Key Features
                          </h3>
                          <ul className="space-y-3">
                            {result.key_features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                {feat}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-blue-400" /> Tools Required
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {result.tools_required.map((tool, i) => (
                              <Badge key={i} variant="secondary" className="px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors">
                                {tool}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-white/10" />

                      {/* Architecture */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-orange-400" /> Architecture Flow
                        </h3>
                        <div className="bg-black/30 p-6 rounded-xl border border-white/5 font-mono text-sm text-muted-foreground whitespace-pre-wrap">
                          {result.architecture_flow}
                        </div>
                      </div>

                      {/* Extra Actions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="h-12 border-white/10 bg-white/5 hover:bg-white/10 hover:text-primary">
                              <Users className="w-4 h-4 mr-2" />
                              Viva Questions
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-card border-white/10">
                            <DialogHeader>
                              <DialogTitle>Viva Questions</DialogTitle>
                              <DialogDescription>Prepare for your project defense.</DialogDescription>
                            </DialogHeader>
                            <ul className="space-y-4 mt-4">
                              {result.viva_questions.map((q, i) => (
                                <li key={i} className="bg-white/5 p-4 rounded-lg text-sm">{q}</li>
                              ))}
                            </ul>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="h-12 border-white/10 bg-white/5 hover:bg-white/10 hover:text-primary">
                              <FileText className="w-4 h-4 mr-2" />
                              Interview Qs
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-card border-white/10">
                            <DialogHeader>
                              <DialogTitle>Interview Questions</DialogTitle>
                              <DialogDescription>Common questions recruiters might ask about this project.</DialogDescription>
                            </DialogHeader>
                            <ul className="space-y-4 mt-4">
                              {result.interview_questions.map((q, i) => (
                                <li key={i} className="bg-white/5 p-4 rounded-lg text-sm">{q}</li>
                              ))}
                            </ul>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="h-12 border-white/10 bg-white/5 hover:bg-white/10 hover:text-primary">
                              <Sparkles className="w-4 h-4 mr-2" />
                              Enhancements
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-card border-white/10">
                            <DialogHeader>
                              <DialogTitle>Future Enhancements</DialogTitle>
                              <DialogDescription>Ways to scale this project further.</DialogDescription>
                            </DialogHeader>
                            <ul className="space-y-4 mt-4">
                              {result.future_enhancements.map((q, i) => (
                                <li key={i} className="bg-white/5 p-4 rounded-lg text-sm flex gap-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                   {q}
                                </li>
                              ))}
                            </ul>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <Button 
                        onClick={() => {
                          setResult(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                      >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Generate Another Idea
                      </Button>

                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
