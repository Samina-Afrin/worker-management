
import React from "react";

const Dashboard = () => {
  return (
     <>
     
    <div className="page-header">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">An easy way to manage sales with care and precision.</p>
      </div>
      <button className="btn-date-picker" type="button" id="date-picker-trigger">
        <i className="bi bi-calendar4-event"></i>
        <span id="selected-date-range">January 12, 2026 - January 23, 2026</span>
        <i className="bi bi-chevron-down ms-1"></i>
      </button>
    </div>
    <div className="row g-4">
      <div className="col-12">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card alert-green-card">
              <div className="position-relative z-index-2">
                <span className="alert-green-badge">Update</span>
                <div className="alert-green-date">Feb 14th 2026</div>
                <div className="alert-green-text">Sales revenue increased 40% in 1 week</div>
              </div>
              <a href="#" className="alert-green-link z-index-2" id="alert-link-statistics">
                <span>See Statistics</span>
                <i className="bi bi-arrow-right"></i>
              </a>

              <svg className="alert-green-bg-shape" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(50,50)">
                  <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" />
                  <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" transform="rotate(60)" />
                  <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" transform="rotate(120)" />
                </g>
              </svg>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card card-stat d-flex flex-column justify-content-between">
              <div>
                <div className="card-header">
                  <span className="stat-label">Net Income</span>
                  <div className="dropdown">
                    <button className="card-more-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                      aria-label="More Options" id="btn-more-income">
                      <i className="bi bi-three-dots"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom">
                      <li><a className="dropdown-item" href="#"><i className="bi bi-arrow-repeat"></i> Refresh</a></li>
                      <li><a className="dropdown-item" href="#"><i className="bi bi-file-earmark-arrow-down"></i> Export
                          Report</a></li>
                      <li>
                        <hr className="dropdown-divider"/>
                      </li>
                      <li><a className="dropdown-item text-danger" href="#"><i className="bi bi-eye-slash"></i> Hide Details</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="stat-value">$196.000</div>
                <div className="trend-badge trend-up">
                  <i className="bi bi-arrow-up-right"></i>
                  <span>+35% from last month</span>
                </div>
              </div>
              <div className="sparkline-container sparkline-card-footer">
                <div id="income-sparkline"></div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card card-stat d-flex flex-column justify-content-between">
              <div>
                <div className="card-header">
                  <span className="stat-label">Total Return</span>
                  <div className="dropdown">
                    <button className="card-more-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                      aria-label="More Options" id="btn-more-return">
                      <i className="bi bi-three-dots"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom">
                      <li><a className="dropdown-item" href="#"><i className="bi bi-arrow-repeat"></i> Refresh</a></li>
                      <li><a className="dropdown-item" href="#"><i className="bi bi-file-earmark-arrow-down"></i> Export
                          Report</a></li>
                      <li>
                        <hr className="dropdown-divider"/>
                      </li>
                      <li><a className="dropdown-item text-danger" href="#"><i className="bi bi-eye-slash"></i> Hide Details</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="stat-value">$32.000</div>
                <div className="trend-badge trend-down">
                  <i className="bi bi-arrow-down-left"></i>
                  <span>-24% from last month</span>
                </div>
              </div>
              <div className="sparkline-container sparkline-card-footer">
                <div id="return-sparkline"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-xl-9 col-lg-8">
        <div className="row g-4">
          <div className="col-12">
            <div className="card mb-0">
              <div className="card-header mb-2">
                <h2 className="card-title">Revenue</h2>
                <div className="d-flex gap-3 align-items-center">
                  <div className="chart-legend-item">
                    <span className="legend-dot bg-forest-medium"></span>
                    <span className="chart-legend-label">Income</span>
                  </div>
                  <div className="chart-legend-item">
                    <span className="legend-dot bg-lime-accent"></span>
                    <span className="chart-legend-label">Expenses</span>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-baseline gap-2 mb-3">
                <span className="stat-value-amount">$196.000</span>
                <span className="trend-badge trend-up fs-xs">+35% from last month</span>
              </div>
              <div id="revenue-chart"></div>
            </div>
          </div>
          
          <div className="col-md-7 d-flex flex-column">
            <div className="card h-100 flex-grow-1">
              <div className="card-header">
                <h2 className="card-title">Transaction</h2>
                <div className="dropdown">
                  <button className="card-more-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                    aria-label="More Options" id="btn-more-transaction">
                    <i className="bi bi-three-dots"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom">
                    <li><a className="dropdown-item" href="#"><i className="bi bi-funnel"></i> Filter Status</a></li>
                    <li><a className="dropdown-item" href="#"><i className="bi bi-file-earmark-arrow-down"></i> Export CSV</a>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="transaction-list">
                <div className="transaction-item">
                  <div className="transaction-icon bg-forest-light text-lime">
                    <i className="bi bi-spotify"></i>
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-name">Spotify Subscription</div>
                    <div className="transaction-date">Feb 14, 2026 • 12:40 PM</div>
                  </div>
                  <div className="transaction-amount text-main">-$15.00</div>
                </div>

                <div className="transaction-item">
                  <div className="transaction-icon bg-forest-light text-lime">
                    <i className="bi bi-paypal"></i>
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-name">Paypal Transfer</div>
                    <div className="transaction-date">Feb 13, 2026 • 08:15 AM</div>
                  </div>
                  <div className="transaction-amount text-success">+$1,250.00</div>
                </div>

                <div className="transaction-item">
                  <div className="transaction-icon bg-forest-light text-lime">
                    <i className="bi bi-stripe"></i>
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-name">Stripe Payout</div>
                    <div className="transaction-date">Feb 11, 2026 • 04:30 PM</div>
                  </div>
                  <div className="transaction-amount text-success">+$3,400.00</div>
                </div>

                <div className="transaction-item">
                  <div className="transaction-icon bg-forest-light text-lime">
                    <i className="bi bi-slack"></i>
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-name">Slack Pro Workspace</div>
                    <div className="transaction-date">Feb 09, 2026 • 09:20 AM</div>
                  </div>
                  <div className="transaction-amount text-main">-$45.00</div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="col-md-5 d-flex flex-column">
            <div className="card h-100 flex-grow-1">
              <div className="card-header">
                <h2 className="card-title">Product Overview</h2>
                <div className="dropdown">
                  <button className="card-more-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"
                    aria-label="More Options" id="btn-more-products">
                    <i className="bi bi-three-dots"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-custom">
                    <li><a className="dropdown-item" href="#"><i className="bi bi-plus-lg"></i> Add Product</a></li>
                    <li><a className="dropdown-item" href="#"><i className="bi bi-gear"></i> Manage</a></li>
                  </ul>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-label-row">
                  <span className="progress-label">Product Launched</span>
                  <span className="progress-value">233</span>
                </div>
                <div className="progress" role="progressbar" aria-label="Product Launched Progress" aria-valuenow="65"
                  aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar bg-lime-accent w-65"></div>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-label-row">
                  <span className="progress-label">Ongoing Product</span>
                  <span className="progress-value">23</span>
                </div>
                <div className="progress" role="progressbar" aria-label="Ongoing Product Progress" aria-valuenow="20"
                  aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar bg-lime-accent opacity-50 w-50"></div>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-label-row">
                  <span className="progress-label">Product Sold</span>
                  <span className="progress-value">482</span>
                </div>
                <div className="progress" role="progressbar" aria-label="Product Sold Progress" aria-valuenow="85"
                  aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar bg-lime-accent w-85"></div>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-label-row">
                  <span className="progress-label">Product Returned</span>
                  <span className="progress-value">8</span>
                </div>
                <div className="progress" role="progressbar" aria-label="Product Returned Progress" aria-valuenow="10"
                  aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar bg-brand-orange w-38"></div>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-label-row">
                  <span className="progress-label">Product In Stock</span>
                  <span className="progress-value">1,420</span>
                </div>
                <div className="progress" role="progressbar" aria-label="Product In Stock Progress" aria-valuenow="75"
                  aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar bg-lime-accent w-75"></div>
                </div>
              </div>

              <div className="progress-container">
                <div className="progress-label-row">
                  <span className="progress-label">Pending Shipment</span>
                  <span className="progress-value">64</span>
                </div>
                <div className="progress" role="progressbar" aria-label="Pending Shipment Progress" aria-valuenow="45"
                  aria-valuemin="0" aria-valuemax="100">
                  <div className="progress-bar bg-lime-accent opacity-50 w-45"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
        

      </div>
      
      <div className="col-xl-3 col-lg-4">
        <div className="right-panel-wrapper d-flex flex-column gap-4 h-100">
          
          <div className="card flex-grow-1 d-flex flex-column justify-content-between mb-0">
            <div className="card-header mb-1">
              <h2 className="card-title">Total View Performance</h2>
            </div>

            <div id="views-chart"></div>
            
            <div className="chart-legends-container">
              <div className="chart-legend-item">
                <span className="legend-dot bg-lime-accent"></span>
                <span className="text-muted-green">View Count</span>
              </div>
              <div className="chart-legend-item">
                <span className="legend-dot bg-forest-medium"></span>
                <span className="text-muted-green">Percentage</span>
              </div>
              <div className="chart-legend-item">
                <span className="legend-dot bg-brand-orange"></span>
                <span className="text-muted-green">Sales</span>
              </div>
            </div>
          </div>


          <div className="promo-banner-card">
            <svg className="promo-banner-bg-shape" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(50,50)">
                <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" />
                <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" transform="rotate(60)" />
                <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill="#B4F105" transform="rotate(120)" />
              </g>
            </svg>

            <h3 className="promo-title">Level up your sales managing to the next level.</h3>
            <p className="promo-desc">An easy way to manage sales with care and precision.</p>
            <button className="btn-promo" id="btn-promo-action">Check the updates now</button>
          </div>
        </div>
      </div>
      

    </div>
    

     </>
     
  );
}

export default Dashboard;
