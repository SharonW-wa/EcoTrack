import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { feedbackAPI } from '@/services/api';
import { toast } from 'sonner';
import {
  MessageSquare,
  Star,
  Send,
  ThumbsUp,
  AlertCircle,
  Lightbulb,
  Bug,
  User,
  Calendar
} from 'lucide-react';

interface Feedback {
  id: string;
  userName: string;
  type: string;
  message: string;
  rating: number;
  createdAt: string;
}

const feedbackTypes = [
  { id: 'suggestion', name: 'Suggestion', icon: Lightbulb, color: 'bg-yellow-100 text-yellow-700' },
  { id: 'complaint', name: 'Complaint', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  { id: 'compliment', name: 'Compliment', icon: ThumbsUp, color: 'bg-green-100 text-green-700' },
  { id: 'bug', name: 'Bug Report', icon: Bug, color: 'bg-purple-100 text-purple-700' },
];

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [message, setMessage] = useState('');
  const [selectedType, setSelectedType] = useState('suggestion');
  const [rating, setRating] = useState(5);
  const [, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const data = await feedbackAPI.getAll();
        setFeedbackList(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setSubmitting(true);
    
    try {
      await feedbackAPI.submit(selectedType, message, rating);
      toast.success('Feedback submitted successfully!');
      
      // Refresh feedback list
      const data = await feedbackAPI.getAll();
      setFeedbackList(data);
      
      // Reset form
      setMessage('');
      setRating(5);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const feedbackType = feedbackTypes.find(t => t.id === type);
    const Icon = feedbackType?.icon || MessageSquare;
    return Icon;
  };

  const getTypeColor = (type: string) => {
    const feedbackType = feedbackTypes.find(t => t.id === type);
    return feedbackType?.color || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-4">
            <MessageSquare className="w-4 h-4 mr-2" />
            Feedback & Reviews
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Share Your Thoughts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your feedback helps us improve. Let us know what you think about our app!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                  Submit Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Feedback Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Feedback Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {feedbackTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setSelectedType(type.id)}
                            className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                              selectedType === type.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <Icon className={`w-5 h-5 mr-2 ${
                              selectedType === type.id ? 'text-green-600' : 'text-gray-400'
                            }`} />
                            <span className="text-sm font-medium">{type.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                          aria-label={'Rate ${star}stars'} //
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Feedback
                    </label>
                    <Textarea
                      placeholder="Tell us what you think..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Feedback */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedbackList.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {feedbackList.slice().reverse().map((feedback, index) => {
                      const Icon = getTypeIcon(feedback.type);
                      return (
                        <motion.div
                          key={feedback.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeColor(feedback.type)}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{feedback.userName}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < feedback.rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm ml-10">{feedback.message}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No feedback yet</p>
                    <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
            <CardContent className="p-8 lg:p-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Need Direct Support?</h2>
                <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                  If you have urgent issues or need immediate assistance, 
                  feel free to reach out to our support team directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="flex items-center justify-center space-x-2 bg-white/10 rounded-lg px-6 py-3">
                    <MessageSquare className="w-5 h-5" />
                    <span>support@ecotrack.co.ke</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 bg-white/10 rounded-lg px-6 py-3">
                    <User className="w-5 h-5" />
                    <span>+254 712 345 678</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
