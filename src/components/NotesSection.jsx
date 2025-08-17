import React, { useState, useEffect } from 'react';
import { notesAPI } from '../services/api';
import { toast } from 'react-toastify';

const NotesSection = ({ videoId }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState('');

    useEffect(() => {
        fetchNotes();
    }, [videoId, searchTerm, selectedTags]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const params = {
                videoId,
                search: searchTerm,
                tags: selectedTags
            };

            const response = await notesAPI.getNotes(params);
            
            if (response.data.success) {
                setNotes(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            toast.error('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        try {
            setSubmitting(true);
            const noteData = {
                title: formData.title,
                content: formData.content,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                videoId
            };

            let response;
            if (editingNote) {
                response = await notesAPI.updateNote(editingNote._id, noteData);
            } else {
                response = await notesAPI.createNote(noteData);
            }

            if (response.data.success) {
                toast.success(editingNote ? 'Note updated successfully' : 'Note created successfully');
                resetForm();
                fetchNotes();
            }
        } catch (error) {
            console.error('Error saving note:', error);
            toast.error('Failed to save note');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (note) => {
        setEditingNote(note);
        setFormData({
            title: note.title,
            content: note.content,
            tags: note.tags.join(', ')
        });
        setShowForm(true);
    };

    const handleDelete = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await notesAPI.deleteNote(noteId);
            
            if (response.data.success) {
                toast.success('Note deleted successfully');
                fetchNotes();
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.error('Failed to delete note');
        }
    };

    const resetForm = () => {
        setFormData({ title: '', content: '', tags: '' });
        setShowForm(false);
        setEditingNote(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get all unique tags from notes
    const allTags = [...new Set(notes.flatMap(note => note.tags))];

    return (
        <div className="card h-fit fade-in">
            <div className="card-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>Notes</h3>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{notes.length} total</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-success px-3 py-1 text-xs"
                    >
                        {showForm ? 'Cancel' : 'Add Note'}
                    </button>
                </div>
            </div>

            {/* Search and filter */}
            <div className="space-y-2 mb-4">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input"
                />
                
                {allTags.length > 0 && (
                    <select
                        value={selectedTags}
                        onChange={(e) => setSelectedTags(e.target.value)}
                        className="input"
                    >
                        <option value="">All tags</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Add/Edit form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="card mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Note title..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input"
                            required
                        />
                        <textarea
                            placeholder="Note content..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={4}
                            className="input resize-none"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Tags (comma separated)..."
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="input"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn btn-success px-3 py-1 text-xs flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                                        {editingNote ? 'Updating...' : 'Saving...'}
                                    </>
                                ) : (
                                    editingNote ? 'Update Note' : 'Save Note'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={submitting}
                                className="btn btn-secondary px-3 py-1 text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Notes list */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="skeleton h-4 w-1/2"></div>
                                <div className="skeleton h-4 w-12"></div>
                            </div>
                            <div className="space-y-1">
                                <div className="skeleton h-3 w-full"></div>
                                <div className="skeleton h-3 w-3/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : notes.length === 0 ? (
                <div className="text-center py-8">
                    <div 
                        className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-3"
                        style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                        <svg className="w-6 h-6" style={{ color: 'var(--text-muted)' }} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h4a2 2 0 002-2V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 8a1 1 0 100-2h-3a1 1 0 100 2h3z" clipRule="evenodd"/>
                        </svg>
                    </div>
                    <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No Notes Found</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        {searchTerm || selectedTags ? 'No notes match your search criteria.' : 'Start by creating your first note.'}
                    </p>
                    {!showForm && !searchTerm && !selectedTags && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="btn btn-success px-3 py-1 text-xs"
                        >
                            Create First Note
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {notes.map((note) => (
                        <div key={note._id} className="group card transition-colors" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                    {note.title}
                                </h4>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(note)}
                                        className="text-xs transition-colors"
                                        style={{ color: 'var(--accent-primary)' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="text-xs transition-colors"
                                        style={{ color: 'var(--error)' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            
                            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                                {note.content}
                            </p>
                            
                            {note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {note.tags.map((tag, index) => (
                                        <span key={index} className="tag">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            
                            <div className="flex justify-between items-center text-xs" style={{ color: 'var(--text-muted)' }}>
                                <span>Created {formatDate(note.createdAt)}</span>
                                {note.updatedAt !== note.createdAt && (
                                    <span>Updated {formatDate(note.updatedAt)}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotesSection;