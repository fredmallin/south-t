import React from "react";
import "../App.css"; 

function SchoolManagement() {
  return (
   <div className="management-page">
      {/* Hero Section */}
     <section className="hero management-hero">
  <div className="hero-overlay">
    <h1>Our School Management</h1>
    <p>Shaping Character, Nurturing Excellence</p>
  </div>
</section>
      {/* Management Section */}
      <section className="management-section">
        <h2>School Management</h2>
        <p className="intro">
          Giakanja Boys High School is guided by a strong leadership team that
          works tirelessly to ensure academic excellence, discipline, and
          holistic growth of all students.
        </p>

        {/* Board of Management */}
        <div className="management-card">
          <img
            src="/images/senior.jpeg"
            alt="Board of Management Chair"
            className="management-image"
          />
          <h3>The Board of Management (B.O.M.)</h3>
          <p>
            Led by <strong>Mr. [Insert BOM Chair’s Name]</strong>, this
            dedicated team provides strategic direction and support. The board
            has remained the backbone of Giakanja Boys, ensuring resources,
            policies, and structures are in place to nurture success.
          </p>
        </div>

        {/* Parent Teacher Association */}
        <div className="management-card">
          <img
            src="/images/principal.jpeg"
            alt="Parent Teacher Association Chair"
            className="management-image"
          />
          <h3>The Parent Teacher Association (P.T.A.)</h3>
          <p>
            Under the leadership of <strong>Prof. [Insert PTA Chair’s Name]</strong>, 
            the PTA unites parents and teachers to collaborate in shaping the
            future of Giakanja Boys. Together, they strengthen the school’s
            academic and co-curricular programs for the benefit of every
            student.
          </p>
        </div>


        {/* School Administration */}
        <div className="management-card">
          <img
            src="/images/chair.jpeg"
            alt="Principal"
            className="management-image"
          />
          <h3>The School Administration</h3>
          <p>
            Led by the <strong>Principal, Mr. [Insert Principal’s Name]</strong>,
            the administration forms the heart of Giakanja Boys. It is supported
            by the “Pentagon,” which consists of Deputy Principals and Senior
            Masters (Routine, Welfare, and Services). Their teamwork ensures
            discipline, smooth operations, and academic excellence.
          </p>
        </div>
      </section>
    </div>
  );
}

export default SchoolManagement;
