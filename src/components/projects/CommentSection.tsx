import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthProvider";
import { apiRequest } from "../../lib/queryClient";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { useToast } from "../../hooks/use-toast";
import { Send, Paperclip, Camera } from "lucide-react";
import type { Comment, User } from "../../shared/schema";

interface CommentSectionProps {
  projectId: number;
  comments: (Comment & { user: User })[];
}

export const CommentSection = ({ projectId, comments }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const userName = user?.name || "User";
  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase();

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/comments`, JSON.stringify({ content }));
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      setNewComment("");
      toast({
        title: "Comment posted",
        description: "Your comment has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      commentMutation.mutate(newComment.trim());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Comments List */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {comments && comments.length > 0 ? (
              comments.map((comment) => {
                const commentUserInitials = comment.user.name
                  .split(" ")
                  .map(n => n[0])
                  .join("")
                  .toUpperCase();
                
                return (
                  <div key={comment.id} className="bg-white rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {commentUserInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{comment.user.name}</span>
                          <span className="text-xs text-gray-500 capitalize">{comment.user.role}</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt.toString())}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-8">
                No comments yet. Start the conversation!
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Comment Input */}
      <div className="flex space-x-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-orange-500 text-white text-sm">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment to communicate with the team..."
            className="resize-none"
            rows={3}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" disabled>
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || commentMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
