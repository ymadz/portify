'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Select, Textarea, SearchableSelect } from '@/components';

export default function AdminForm({ fields, initialData, onSubmit, onCancel, isLoading }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Init empty
            const empty = {};
            fields.forEach(f => empty[f.name] = '');
            setFormData(empty);
        }
    }, [initialData, fields]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
                {fields.map((field) => {
                    if (field.type === 'select') {
                        return (
                            <Select
                                key={field.name}
                                label={field.label}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                options={field.options}
                                required={field.required}
                            />
                        );
                    }
                    if (field.type === 'search-select') {
                        return (
                            <SearchableSelect
                                key={field.name}
                                label={field.label}
                                value={formData[field.name] || ''}
                                onChange={(val) => handleChange(field.name, val)}
                                options={field.options}
                                required={field.required}
                            />
                        );
                    }
                    if (field.type === 'textarea') {
                        return (
                            <Textarea
                                key={field.name}
                                label={field.label}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                required={field.required}
                                rows={4}
                            />
                        );
                    }
                    return (
                        <Input
                            key={field.name}
                            type={field.type || 'text'}
                            label={field.label}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            required={field.required}
                        />
                    );
                })}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    className="bg-rose-500 hover:bg-rose-600 border-none"
                >
                    {initialData ? 'Update Record' : 'Create Record'}
                </Button>
            </div>
        </form>
    );
}
