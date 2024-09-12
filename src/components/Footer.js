import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import "../css/footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-sm-6">
              <div className="footer-about">
                <h4>About Us</h4>
                <p>We are a company that provides high-quality products and services to our customers.</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="footer-links">
                <h4>Quick Links</h4>
                <ul className="list-unstyled">
                  <li><a href="#">Home</a></li>
                  <li><a href="#">Products</a></li>
                  <li><a href="#">Services</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div className="footer-contact">
                <h4>Contact Us</h4>
                <ul className="list-unstyled">
                  <li>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>123 Main Street, Anytown USA</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faPhone} />
                    <span>(555) 555-5555</span>
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>info@example.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="container">
          <p>&copy; 2023 Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;