import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import JobListingCard from '../JobListingCard';
import Spinner from '../Spinner';
import { Job } from '../../types/Types';
import { UserFormData } from '../../types/Types';
import { API_BASE_URL, DEFAULT_HEADERS_AUTH, INTERNAL_ERROR_500, JOB_FAILED_FETCH } from '../../constants/constants';

/**
 * UserDetail Component - Displays and allows editing of user details.
 * Also shows the list of jobs posted by the user.
 *
 * @component
 * @returns {JSX.Element} The rendered UserDetail component.
 */
const UserDetail: React.FC = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        surname: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
    });
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                surname: user.surname,
                email: user.email,
                username: user.username,
                password: '',
                password_confirmation: '',
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchJobs = async () => {
            if (!user) return;

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_BASE_URL}/users/${user.id}/jobs`, {
                    method: 'GET',
                    headers: DEFAULT_HEADERS_AUTH
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || JOB_FAILED_FETCH);
                }

                const data = await response.json();
                setJobs(data);
            } catch (error: any) {
                setError(error.message || INTERNAL_ERROR_500);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/users/${user?.id}`, {
                method: 'PUT',
                headers: DEFAULT_HEADERS_AUTH,
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to update user.');
            }
        } catch (err: any) {
            setError(err.message || INTERNAL_ERROR_500);
        }
    };

    return (
        <>
            <div className="user-detail-form">
                <h2 className="user-detail-title">User Details / Edit</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="user-detail-input"
                        required
                    />
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        placeholder="Surname"
                        className="user-detail-input"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="user-detail-input"
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="user-detail-input"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="New Password ********"
                        className="user-detail-input"
                        required
                    />
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="Confirm New Password ********"
                        className="user-detail-input"
                        required
                    />
                    <button type="submit" className="user-detail-button">
                        Edit
                    </button>
                </form>
            </div>
            <section className="my-ads-section">
                <div className="my-ads-container">
                    <h2 className="my-ads-title">My Jobs.</h2>

                    {loading ? (
                        <div className="flex justify-center items-center">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <div className="my-ads-error">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {jobs.map((job) => (
                                <JobListingCard
                                    key={job.id}
                                    title={job.title}
                                    description={job.description}
                                    salary={job.salary}
                                    location={job.location}
                                    link={`/jobs/${job.id}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default UserDetail;
