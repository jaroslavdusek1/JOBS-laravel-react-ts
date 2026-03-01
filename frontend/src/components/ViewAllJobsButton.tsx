/**
 * A button component that navigates to the jobs listing page.
 *
 * @component
 * @returns {JSX.Element} The rendered ViewAllJobsButton component.
 */
 import React from 'react';

 const ViewAllJobsButton: React.FC = () => {
     return (
         <section className="button-container">
             <a href="/" className="view-all-jobs-button">
                 View All Jobs
             </a>
         </section>
     );
 };
 
 export default ViewAllJobsButton;
 