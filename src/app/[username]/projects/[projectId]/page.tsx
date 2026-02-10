'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowLeft, Calendar, Folder } from 'lucide-react';
import Link from 'next/link';
import { usePublicProject } from '@/hooks/usePublicProject';

export default function ProjectDetailPage() {
  const params = useParams();
  const username = (params.username as string) || null;
  const projectId = params.projectId ? parseInt(params.projectId as string) : null;

  const { project, loading, error } = usePublicProject(username, projectId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted mb-8">{error || 'The project you are looking for does not exist.'}</p>
          <Link 
            href={`/${username}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Header con botón de regreso */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link 
            href={`/${username}`}
            className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Portfolio
          </Link>
        </div>
      </div>

      {/* Hero Section con Thumbnail */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-gradient-to-b from-black via-black/95 to-black overflow-hidden">
        {project.thumbnail_url && (
          <div className="absolute inset-0">
            <img
              src={project.thumbnail_url}
              alt={project.title}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
        )}
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Folder size={16} className="text-secondary" />
                <span className="text-sm font-medium text-secondary capitalize">
                  {project.category}
                </span>
              </div>
              {project.featured && (
                <span className="px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/40 text-primary text-sm font-medium">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-6">
              {project.repo_url && project.repo_url !== '#' && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full border border-white/20 transition-all"
                >
                  <Github size={20} />
                  View Code
                </a>
              )}
              {project.live_url && project.live_url !== '#' && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-full transition-colors text-white font-medium"
                >
                  <ExternalLink size={20} />
                  Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-primary">About This Project</h2>
              <p className="text-muted text-lg leading-relaxed whitespace-pre-wrap">
                {project.description || 'No description available for this project.'}
              </p>
            </motion.div>

            {/* Project Previews/Gallery */}
            {project.previews && project.previews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-primary">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.previews.map((preview, index) => (
                    <div
                      key={preview.id}
                      className="relative group rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all"
                    >
                      <img
                        src={preview.image_url}
                        alt={preview.caption || `Preview ${index + 1}`}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {preview.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-3">
                          <p className="text-sm text-muted">{preview.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Technologies Used */}
            {project.technologies && project.technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5"
              >
                <h3 className="text-xl font-bold mb-4 text-primary">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <div
                      key={tech.id}
                      className="flex items-center gap-2 px-3 py-2 bg-secondary/10 rounded-lg border border-secondary/20 hover:border-secondary/50 transition-colors"
                    >
                      {tech.icon_url && (
                        <img src={tech.icon_url} alt={tech.name} className="w-5 h-5 object-contain" />
                      )}
                      <span className="text-sm font-medium text-secondary">{tech.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Work Experience Link */}
            {project.work_experience && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5"
              >
                <h3 className="text-xl font-bold mb-4 text-primary">Related Experience</h3>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">{project.work_experience.job_title}</p>
                  <p className="text-sm text-muted">{project.work_experience.company}</p>
                  <p className="text-xs text-muted/70 flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(project.work_experience.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {' - '}
                    {project.work_experience.end_date 
                      ? new Date(project.work_experience.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : 'Present'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl border border-white/10 bg-white/5"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">Quick Links</h3>
              <div className="space-y-3">
                {project.repo_url && project.repo_url !== '#' && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted hover:text-primary transition-colors"
                  >
                    <Github size={20} />
                    View Repository
                  </a>
                )}
                {project.live_url && project.live_url !== '#' && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted hover:text-secondary transition-colors"
                  >
                    <ExternalLink size={20} />
                    Visit Live Site
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
