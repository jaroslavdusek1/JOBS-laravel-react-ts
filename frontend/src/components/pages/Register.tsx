import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Spinner';
import { UserFormData } from '../../types/Types';
import { Message as MessageType } from '../../types/Types';
import { sanitizeInput, validateForm } from '../../utils/validations';
import {
    API_BASE_URL,
    DEFAULT_HEADERS,
    ERROR_MESSAGE,
    INTERNAL_ERROR_500,
    REGISTER_USER_SUCCESS,
    ROUTE_LOGIN,
} from '../../constants/constants';

/**
 * Registration component for user sign-up.
 * Displays a registration form, validates input, and communicates with the backend to create a new user.
 *
 * @component
 * @returns {JSX.Element} The rendered Register component.
 */
const Register: React.FC = () => {
    const navigate = useNavigate();

    /**
     * Initial state for form data
     *
     * @type {UserFormData}
     */
    const initialFormData: UserFormData = {
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    };

    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [message, setMessage] = useState<MessageType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Handles input changes and sanitizes the value.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Allow special characters only for password fields
        const allowSpecialChars = name === 'password' || name === 'password_confirmation';

        const sanitizedValue = sanitizeInput(value, allowSpecialChars);

        setFormData({ ...formData, [name]: sanitizedValue });
    };

    /**
     * Handles form submit by validating input and sending data to the backend.
     *
     * @async
     * @param {React.FormEvent} e - The form submit event.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form inputs
        const { valid, errors } = validateForm(formData);

        if (!valid) {
            setMessage({ text: Object.values(errors).join(', '), type: 'error' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: DEFAULT_HEADERS,
                body: JSON.stringify(formData),
            });

            const rawResponse = await response.json();
            if (response.ok) {
                // Display success message and reset form
                setMessage({ text: REGISTER_USER_SUCCESS, type: 'success' });
                setFormData(initialFormData);

                // Redirect to login page after a delay
                setTimeout(() => navigate(ROUTE_LOGIN), 1500);
            } else {
                // Handle error response
                setMessage({
                    text: rawResponse.error || ERROR_MESSAGE,
                    type: 'error',
                });
            }
        } catch (error) {
            setMessage({ text: INTERNAL_ERROR_500, type: 'error' });
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-heading">Register</h2>

            {/* Display feedback message */}
            {message && (
                <div
                    className={`form-message ${message.type === 'error' ? 'form-message-error' : 'form-message-success'
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Show spinner while loading */}
            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <Spinner />
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Name input field */}
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="form-input"
                        required
                    />
                    {/* Surname input field */}
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        placeholder="Surname"
                        className="form-input"
                        required
                    />
                    {/* Email input field */}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="form-input"
                        required
                    />
                    {/* Username input field */}
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="form-input"
                        required
                    />
                    {/* Password input field */}
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="form-input"
                        required
                    />
                    {/* Password confirmation input field */}
                    <input
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation || ''}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="form-input"
                        required
                    />
                    {/* Submit button */}
                    <button type="submit" className="form-button">
                        Register
                    </button>
                </form>
            )}
        </div>
    );
};

export default Register;
