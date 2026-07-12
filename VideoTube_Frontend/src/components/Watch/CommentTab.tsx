// import type { Video } from '@/types';
import React from 'react'

const CommentTab = ({videoId}: {videoId: string}) => {
   return (
     <div className="space-y-4">
       <textarea
         placeholder="Add a comment..."
         className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] resize-none transition-colors"
         rows={3}
       />
       <button className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
         Post Comment
       </button>
       <p className="text-[var(--text-muted)] text-sm">
         Comments coming soon...
       </p>
     </div>
   );
}

export default CommentTab