import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IBooking } from '../../@types/IBooking';
import { toast } from 'react-toastify';
import { fetchBookingWithId, reviewSubmit } from '../../services/UserSurvice';

const ReviewAndRating = () => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const navigate = useNavigate()
    const theam = useSelector((state: RootState) => state.theme.mode);
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("bookingId");
    const [bookingDetils, setBookingDetils] = useState<IBooking>()
    const [error, setError] = useState({ rating: "", feedback: "" });
    
    console.log('th9is is the bookign detils ::', bookingDetils)

    console.log("Booking ID:", bookingId);

    // useEffect(() => {
    //     if (bookingDetils?.laborId?.reviews && bookingDetils?.laborId?.reviews.length > 0) {
    //         navigate('/');
    //     }
    // }, [bookingDetils]);
    
    const validateForm = () => {
        let isValid = true;
        const errors = { rating: "", feedback: "" };

        if (rating === 0) {
            errors.rating = "Rating is required.";
            isValid = false;
        }

        const wordCount = feedback.trim().split(/\s+/).length;
        if (wordCount < 10) {
            errors.feedback = "Feedback must be at least 10 words.";
            isValid = false;

            setError(errors);
            return isValid;
        };
    }

    console.log('Thissssssssssssssis eh error :',error)

        const handleStarClick = (index: number): void => {
            setRating(index + 1);
        };

        const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
            setFeedback(e.target.value);
        };

        const handleSubmit = async (e: React.FormEvent)  => {
            e.preventDefault(); 
            console.log('tiam hereeeeeeeeeeeeeee.')
            console.log(validateForm())
            if (validateForm()) return;
      
            const formData = new FormData();
            if (bookingId) {
                formData.append("bookingId", bookingId || ""); // Ensure bookingId is not null
            }
            formData.append("rating", rating.toString());
            formData.append("feedback", feedback);
            // formData.append("bookingId", bookingId);

            if (image1) {
                formData.append("image1", image1);
            }
            if (image2) {
                formData.append("image2", image2);
            }
                // console.log("FormData content:");
                // for (let [key, value] of formData.entries()) {
                //     console.log(key, value);
                // }
      
            try {
                 console.log('submitted......')          
                const reviewSumbitResponse = await reviewSubmit(formData, bookingId || ""); 
                console.log('Riveiw respnse ',reviewSumbitResponse)
                if (reviewSumbitResponse.status == 200) {
                    toast.success('Review sumiteed sussfully...')
                    navigate('/')
                }
        
            } catch (error) {
                console.error("Error submitting review:", error);
            }
        };
    
        const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>): void => {
            const file = e.target.files?.[0];
            if (file) {
                setImage(file); // Set the specific image state
            }
        };


    useEffect(() => {
            const fetchBooking = async () => {
                const response = await fetchBookingWithId(bookingId || ""); 
                if (response.status === 200) {
                    const { fetchedBooking } = response.data
                    console.log('helooooooooooooooooooooooo',fetchedBooking)
                    setBookingDetils(fetchedBooking)
                    // toast.success('Booking fetched succesffull')
                } else {
                    // toast.error('Eroor in fetched booking')
                }
            }
            fetchBooking()
        }, [])

        return (
            <>
                {theam === "light" ? (
                    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-center mb-2">Review Rating</h2>
                        {/* Labor Image */}
                        <div className="flex justify-center mb-2">
                            <img
                                src={bookingDetils?.laborId?.profilePicture} // Replace with the actual image URL
                                alt="Labor"
                                className="w-24 h-24 rounded-full object-cover border-2 border-yellow-500"
                            />
                        </div>
                        <p className="text-sm text-gray-600 text-center mb-6">
                            Note: Give a review rating for the labor name for his work
                        </p>

                        <div className="mb-6">
                            <p className="text-lg font-semibold text-center mb-4">
                                How was Johnson's work?
                            </p>
                            <div className="flex justify-center space-x-2">
                                {[...Array(5)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleStarClick(index)}
                                        className={`text-3xl ${index < rating ? "text-yellow-500" : "text-gray-300"
                                            }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {error.rating && <p className="text-red-500 text-center">{error.rating}</p>}
                        </div>

                        <div className="mb-6">
                            <p className="text-lg font-semibold text-center mb-4">
                                Add Photo of his work complete
                            </p>
                            <div className="flex justify-center space-x-4">
                                {/* Image Upload Box */}
                                <label htmlFor="uploadImage1" className="cursor-pointer">
                                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        {image1 ? (
                                            <img
                                                src={URL.createObjectURL(image1)}
                                                className="w-full h-full object-cover"
                                                alt="Uploaded Preview"
                                            />
                                        ) : (
                                            <span className="text-3xl text-gray-400">+</span>
                                        )}
                                    </div>
                                </label>
                
                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    id="uploadImage1"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setImage1)}
                                    className="hidden"
                                />

                                {/* Second Box (Optional for another image) */}
                                <label htmlFor="uploadImage2" className="cursor-pointer">
                                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        {image2 ? (
                                            <img
                                                src={URL.createObjectURL(image2)}
                                                className="w-full h-full object-cover"
                                                alt="Uploaded Preview"
                                            />
                                        ) : (
                                            <span className="text-3xl text-gray-400">+</span>
                                        )}
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="uploadImage2"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, setImage2)}
                                    className="hidden"
                                />
                            </div>
                        </div>


                        <div className="mb-6">
                            <p className="text-lg font-semibold text-center mb-4">
                                Give feedback of this labor
                            </p>
                            <textarea
                                value={feedback}
                                onChange={handleFeedbackChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                rows={4}
                                placeholder="Write your feedback here..."
                            ></textarea>
                            {error.feedback && <p className="text-red-500">{error.feedback}</p>}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || feedback.trim() === ''}
                            className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            Submit the Review
                        </button>
                    </div>
                ) : (
                    <div className="bg-[#111827] min-h-screen ">
                        <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-center mb-2 text-white">
                                Review Rating
                            </h2>

                            {/* Labor Image */}
                            <div className="flex justify-center mb-2">
                                <img
                                    src={bookingDetils?.laborId?.profilePicture}
                                    alt="Labor"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-yellow-500"
                                />
                            </div>

                            <p className="text-sm text-gray-400 text-center mb-6">
                                Note: Give a review rating for {bookingDetils?.laborId?.firstName}{" "}
                                for his work
                            </p>

                            {/* Star Rating */}
                            <div className="mb-6">
                                <p className="text-lg font-semibold text-center mb-4 text-white">
                                    How was {bookingDetils?.laborId?.firstName}{" "}
                                    {bookingDetils?.laborId?.lastName} work?
                                </p>
                                <div className="flex justify-center space-x-2">
                                    {[...Array(5)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleStarClick(index)}
                                            className={`text-3xl ${index < rating ? "text-yellow-400" : "text-gray-500"
                                                }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                {error.rating && <p className="text-red-500 text-center">{error.rating}</p>}
                            </div>

                            {/* Add Photo Section */}
                            <div className="mb-6">
                                <p className="text-lg text-white font-semibold text-center mb-4">
                                    Add Photo of his work complete
                                </p>
                                <div className="flex justify-center space-x-4">
                                    {/* Image Upload Box */}
                                    <label htmlFor="uploadImage1" className="cursor-pointer">
                                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            {image1 ? (
                                                <img
                                                    src={URL.createObjectURL(image1)}
                                                    className="w-full h-full object-cover"
                                                    alt="Uploaded Preview"
                                                />
                                            ) : (
                                                <span className="text-3xl text-gray-400">+</span>
                                            )}
                                        </div>
                                    </label>
                
                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        id="uploadImage1"
                                        accept="image/*"
                                         onChange={(e) => handleImageUpload(e, setImage1)}
                                        className="hidden"
                                    />

                                    {/* Second Box (Optional for another image) */}
                                    <label htmlFor="uploadImage2" className="cursor-pointer">
                                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            {image2 ? (
                                                <img
                                                    src={URL.createObjectURL(image2)}
                                                    className="w-full h-full object-cover"
                                                    alt="Uploaded Preview"
                                                />
                                            ) : (
                                                <span className="text-3xl text-gray-400">+</span>
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        type="file"
                                        id="uploadImage2"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, setImage2)}
                                        className="hidden"
                                    />
                                </div>
                            </div>


                            {/* Feedback Section */}
                            <div className="mb-6">
                                <p className="text-lg font-semibold text-center mb-4 text-white">
                                    Give feedback of this labor
                                </p>
                                <textarea
                                    value={feedback}
                                    onChange={handleFeedbackChange}
                                    className="w-full p-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                    rows={4}
                                    placeholder="Write your feedback here..."
                                ></textarea>
                                {error.feedback && <p className="text-red-500">{error.feedback}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={rating === 0 || feedback.trim() === ''}
                                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            >
                                Submit the Review
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    };

export default ReviewAndRating;
