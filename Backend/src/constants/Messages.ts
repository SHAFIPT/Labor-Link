export const Messages = {
    USERS_FETCH_SUCCESS: "Users found successfully!",
    USER_NOT_FOUND: "User is not found.",
    USERS_FETCH_FAILURE: "Failed to fetch users",
    USER_REQUIERD: "user is required",
    //OTP MESSAGE
    NOT_SUPPORT_OTP: 'OTP sending not supported for this role',
    NOT_SUPPORT_VERIFICATION_OTP: 'OTP verification not supported for this role',
    ERROR_OCCURED_IN_OTP_SENT : "Error occurred while sending OTP.",
    FAILED_TO_SEND_OTP: 'Failed to send OTP',
    OTP_SEND_SUCCESSFULLY: 'OTP sent successfully',
    OTP_VERIFIED_SUCCESSFULLY: 'OTP verified successfully',
    EMAIL_AND_OTP_REQUIRD: 'Email and OTP are required.',
    CHECK_YOU_EMIL: "Check Your Email",
    ENTERD_WRONG_OTP: "Entered wrong OTP.",
    INVALID_ROLE_PROVIDED: "Invalid role provided.",
    PASSWORD_ROLE_TOKEN_REQURIED  : "Password, role, and token are required.",
    ROLE_AND_USER_DATA_REQURIED: "Role and user data are required.",
    INVALID_ROLE_OR_RESEND_OTP_NOT_SUPPORTED: "Invalid role or resend OTP not supported.",
    FAILD_TO_RESEND_OTP: "Failed to resend OTP.",
    OTP_RESEND_SUCCESSFULLY: "OTP resent successfully!",
    REGITSTER_ABOUT_NOT_DEFIND: "registerAboutYou method is not defined in the strategy.",
    ERROR_PARSE_FORM_DATA: "Errror parse form data...",
    ERROR_PROFILE_PAGE_LABOR: 'error occurred ducing profile page submisingon...',
    ERROR_IN_PROFILE_CONTROLLER:"Error in profile controller:" ,
    ERROR_UPLOAD_IMAGE_CLOUDINERY: 'Error uploading image to Cloudinary.',
    IMAGE_REQUERD: 'Image is required.',
    Error_UPLOADING_ID_IMAGE: "Error uploading ID image:",
    FAILD_TO_UPLOAD_IMAGE_ID: "Failed to upload ID image",
    ERROR_UPLOAD_CERTIFICATE_IMAGE: "Error uploading certificate image:",
    EXPERIENCE_SAVED_SUCCESSFULLY: "Experience data saved successfully",
    ERROR_IN_EXPERIENCE_SUBMIT : 'Error occurred during ExperiencePage submission!',

    //RESET editPassword
    PASSWORD_RESET_SUCCESSFULY: "Password reset successful.",

    //ERROR IN forgetPasswordVerify
    FORGET_PASSWORD_ERROR : "Error in forgetPassword:",

    //GOOGLE MESSAGE
    GOOGLE_SIGN_IN_NOT_SUPPPORT: "Google Sign-In not supported for this role",
    GOOGLE_SIGN_IN_FAILD: "Google Sign-In failed",
    GOOGLE_SIGN_IN_SUCCESS: "Google Sign-In successful",
    GOOGLE_SIGN_IN_ERROR: "Google Sign-In Error:",

    //BLOCK User
    ACCOUNT_IS_BLOCKED: "Account is blocked",
    USER_NOT_FOUND_CHECK_YOU_EMIL : "User not found. Check your email.",
    
    EMAIL_AND_ROLE_REQUIRED : "Email and role are required.",
    INVALID_ROLE : "Invalid role provided.",
    
    PROFILE_UPDATE_SUCCESS: "Profile updated successfully!",
    PROFILE_UPDATE_FAILURE: "Failed to update profile. Please try again.",
    FORM_PARSE_ERROR: "Error parsing form data.",
    
    PASSWORD_UPDATE_SUCCESS: "Password updated successfully!",
    PASSWORD_UPDATE_FAILURE: "Failed to update password.",
    EMAIL_PASSWORD_REQUIRED: "Email and Password are required.",
    AUTH_REQUIRED: "Authentication required",

    //logout message
    LOGOUT_SUCCESS: "Logout successful",
    LOGOUT_FAILED: "Logout failed",

    //TokenRefresh
    TOKEN_REFRESHED: 'Token refreshed successfully',
    TOKEN_REFRESHED_FAILD: 'Token refresh failed',
    SESSION_EXPIRED : "Session expired. Try again.",
    
    // Booking Messages
    BOOKING_SUCCESS: "Booking created successfully",
    BOOKING_MISSING_FIELDS: "Missing required fields",
    BOOKING_MISSING_QUOTE_FIELDS: "Missing required quote fields",
    BOOKING_MISSING_ADDRESS_FIELDS: "Missing required address fields",
    BOOKING_NOT_FOUND: "Booking ID is not found",
    BOOKINGS_FETCH_SUCCESS: "Bookings fetched successfully!",
    BOOKINGS_FETCH_FAILURE: "Failed to fetch bookings",
    BOOKING_USER_ID_MISSING: "User ID is missing",

    // Cancel Booking Messages
    CANCEL_BOOKING_SUCCESS: "Booking canceled successfully",
    CANCEL_BOOKING_MISSING_ID: "No booking ID found",
    CANCEL_BOOKING_FAILURE: "Failed to cancel booking",
    
    EMAIL_NOT_PROVIDED: "Email is required.",
    LABOR_ID_FETCH_SUCCESS: "Labor ID fetched successfully!",
    LABOR_ID_FETCH_FAILURE: "Failed to fetch Labor ID.",

    // Read Status Messages
    BOOKING_READ_STATUS_UPDATED: "Read status updated successfully",
    BOOKING_ID_REQUIRED: "Booking ID is required",

     // Reschedule Messages
    RESCHEDULE_SUCCESS: "Booking reschedule request sent successfully",
    RESCHEDULE_MISSING_FIELDS: "Missing required reschedule details",

    // Work Completion
    WORK_COMPLETION_SUCCESS: "Work completion request has been submitted successfully.",
    WORK_COMPLETION_MISSING_FIELDS: "Missing required fields for work completion.",

    // Payment Messages
    PAYMENT_SUCCESS: "Payment is successful",
    PAYMENT_MISSING_FIELDS: "Missing required fields for payment processing",

    WEBHOOK_RECEIVED: "Webhook received successfully",
    WEBHOOK_ERROR: "Error processing webhook",
    INVALID_SIGNATURE: "Invalid Stripe signature",

    // Review Messages
    REVIEW_SUBMIT_SUCCESS: "Review submitted successfully",
    REVIEW_MISSING_BOOKING_ID: "Booking ID is not found",
    REVIEW_FORM_PARSE_ERROR: "Error parsing form data",
    REVIEW_UPLOAD_ERROR: "Error in review submission",

    // Search Messages
    SEARCH_QUERY_TOO_SHORT: "Search query must be at least 2 characters",
    SEARCH_SUGGESTIONS_SUCCESS: "Search suggestions retrieved successfully",

    //laborside
    LABOR_ID_NOTFOUND: "Laobr ID not found",
    LABOR_LOGIN_SUCCESSFULLY: "Labor fetch successfully .",
    ERROR_IN_FETCH_LABORS: "error occurd during fetch labors....!",
    LABOR_PROFILE_UPDATED_SUCCESSFULLY: "Labor profile updated successfully!",
    ERROR_UPDATE_LABOR_PROFILE: "Error updating labor profile:",
    EMIAL_PASSWORD_MISSING: "Email and Password is missing...!",
    PASSWORD_UPDATED_SUCCESSFULLY: "Password updated successfully!",
    ERROR_IN_UPDATE_PASSWORD: "Error updating profile:",
    LATITTUDE_LOGITUDE_REQUIERD: "Latitude and Longitude are required.",
    INVALID_LATITUDE_AND_LOGITUDE: "Invalid latitude or longitude.",
    ERROR_IN_FETCH_LABOR_BY_LOCATION: "Error in fetch Labor by location",
    ABOUT_PAGE_UPDTAED_SUCCESSFULLY: "Abbout udpated successfully....",
    ERROR_IN_ABOUT_PAGE: "Error about me:",
    LABOR_NOT_FOUND: "Labor not Found.",
    NO_BOOKING_FOUND_BY_LABOR: "No bookings found by labor",
    CATEGORY_REQUIERD: "Category is required.",
    SIMILOR_LABOR_FETCHED_SUCCESSFULY: "Similar labors fetched successfully.",
    ERROR_IN_FETCH_SIMILOR_LABOR: "Error fetching similar labors:",
    BOOKING_ID_NOT_FOUND: 'Booking id is not found...',
    BOOKING_FETCH_FAILD: "Error fetching bookings:",
    RESHEDULE_REQUEST_SENT_SUCCESSFULLY: 'resheduleRequst has been sent....', 
    ERROR_IN_RESHEDULE_REJECTION: "Error submit Rejection:",
    ACCEPT_RESHEDULE_REQUEST: "Accept reshedule successfully",
    ERROR_IN_ACCEPT_RESHEDULE_REQUEST: "Error accetpt rejection:",
    FIELDS_REQUEIRD: "Missing required fields like bookingId or amout or reason",
    ADDITIONAL_CHARGE_UPDATED_SUCCESSFULLY: "additional charge is has been updatedSucceffly ",
    ERROR_IN_ADDITIONAL_CHARGE: "Error in additionalCharge:",
    ADDITIONAL_CHARGE_ACCEPTED_SUCCESSFULLY: "additional charge accept ,,,,",
    ERROR_ID_ADDITIONAL_CHARGE_ACCEPT: "Error in additional charge accept:",
    ADDITIONAL_CHARGE_REJECTED_SUCESSFULLY: "additional charge reject ,,,,",
    ERROR_IN_ADDITINAL_CHARGE_REJECTED: "additional charge reject",
    MISSING_USER_ID_LABOR_ID: "Missing userId or laborId",
    MISSING_LABOR_EMAIL: "Missing laborId",
    FETCH_LABOR_SUCCESSFULLY: "labors fetch succef fullyy",
    AMOUNT_AND_BANKDETAILS_MISSING: "Amount and bankdetisl are missing ",
    WALLET_WITHDROW_REQUEST_SEND_SUCCESSFULLY: "wallet Withdrow requst send succeffuly....",
    ERROR_IN_WITHDROW_REQUEST: "Error in withdrawal request: ",
    WITHDROW_REQUEST_FETCHED_SUCCESSFULY: "withdrowal Requsets fetched succussfully......",
    ERROR_IN_WITHDROW_REQUEST_FETCH: "Error in witthrowal requests....: ",
    LABOR_FETCH_SUCCESSFULY : 'labors fetched successfully....',
    FAILD_TO_FETCH_LABORS: 'faild to fetch the labors .....',
    USER_BLOCKED_SUCCESSFULY : 'User blocked successfully ' ,
    USER_UNBLOCKED_SUCCESSFULY : 'User Un-blocked successfully ' ,
    LABOR_BLOCKED_SUCCESSFULY : 'Labor blocked successfully ' ,
    LABOR_UNBLOCKED_SUCCESSFULY : 'Labor Un-blocked successfully ' ,
    LABOR_SUCCESSFULY_APPROVED : 'Labor approved successfully ' ,
    LABOR_SUCCESSFULY_UNAPPROVED : 'Labor Un-approved successfully ' ,
    LABOR_REJECTION_SUBMITED_SUCCESSFULLY: 'Labor rejection submited successfully ',
    
    DELETE_LAOBR_SUCCESSFULL: 'Delete labor successfull ',
    ERROR_IN_LABOR_REMOVAL: 'Error in labor removal...',
    WITHDROWAL_FETCH_SUCCESSFULL: 'widthdrow fetched succesfully...',
    WITHDOWAL_ID_IS_MISSING : "wITHDROW ID IS MISSING ;:",
    WITHDOWAL_STATUS_IS_MISSING: "wITHDROW STATUS IS MISSING ;:",
    ACTION_SUBMITED_SUCCSSFULLY : 'ACTION SUBMITED SUCCSSUSFULY ..',
    
    INTERNAL_SERVER_ERROR: "An unexpected error occurred. Please try again later.",
};