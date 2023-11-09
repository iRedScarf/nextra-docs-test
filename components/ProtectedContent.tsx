import React, {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useState
} from "react";
import useSWR from "swr";
import PasswordInput from "./PasswordInput";

interface ProtectedContentProps {
  children: ReactNode;
}

// Fetcher function to be used with useSWR for data fetching
const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then((res) => res.json());

// Component to wrap around content that should be protected by a password
const ProtectedContent: React.FC<ProtectedContentProps> = ({ children }) => {
  const [password, setPassword] = useState(""); // State for the password input
  const [message, setMessage] = useState(""); // State for displaying messages to the user
  const { data, error: swrError, mutate } = useSWR("/api/auth", fetcher); // Use SWR for data fetching

  // Show an error message if there's a loading error
  if (swrError) {
    return <div className="flex items-center justify-center my-5">Loading failed, please refresh the page and retry.</div>;
  }

  // Show a loading indicator while the data is being fetched
  if (!data) {
    return <div className="flex items-center justify-center my-5">Loading...</div>;
  }

  // If the user is already authenticated, display the protected content
  if (data.authenticated) {
    return <>{children}</>;
  }

  // Handle changes to the password input field
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setMessage(""); // Clear any messages when the user types
  };

  // Clear any displayed messages
  const clearMessage = () => {
    setMessage("");
  };

  // Handle the form submission for the password input
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // If the password is empty, display a message and prevent submission
    if (!password.trim()) {
      setMessage("Please enter the password.");
      return;
    }

    // Send a POST request to the authentication API with the provided password
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }), // Send the password in the request body
    });

    // If the response is OK, the password was correct, and the user is authenticated
    if (response.ok) {
      setMessage(""); // Clear any messages
      mutate(); // Revalidate the SWR data to update the state
    } else {
      // If the response is not OK, display the error message from the server
      const responseData = await response.json();
      setMessage(responseData.message);
      setPassword(""); // Clear the password field on error
    }
  };

  return (
    <div className="text-center">
      <form onSubmit={handleSubmit}>
        <PasswordInput
          password={password}
          handleChange={handleChange}
          handleFocus={clearMessage}
          handleBlur={clearMessage}
        />
      </form>
      {message && <p className="text-center">{message}</p>}
    </div>
  );
};

export default ProtectedContent;
