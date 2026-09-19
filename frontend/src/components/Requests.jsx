import { useState } from 'react'

function Requests() {
  const [requests, setRequests] = useState([
    {
      id: 'R001',
      learnerName: 'Rahul',
      skillName: 'React',
      message: 'I would like to learn React from you.',
      status: 'pending',
      date: '2026-09-19',
    },
  ])

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const updateStatus = (id, newStatus) => {
    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request.id === id
          ? { ...request, status: newStatus }
          : request
      )
    )
  }

  const submitFeedback = () => {
    setFeedbackSubmitted(true)
  }

  return (
    <div>
      <h2>Learning Requests</h2>

      {requests.map((request) => (
        <div className="request-card" key={request.id}>
          <h3>{request.skillName}</h3>

          <p>
            <strong>From:</strong> {request.learnerName}
          </p>

          <p>{request.message}</p>

          <p>
            <strong>Status:</strong>{' '}
            <span className="status">{request.status}</span>
          </p>

          <p>
            <strong>Requested on:</strong> {request.date}
          </p>

          {request.status === 'pending' && (
            <div>
              <button onClick={() => updateStatus(request.id, 'accepted')}>
                Accept
              </button>

              <button onClick={() => updateStatus(request.id, 'rejected')}>
                Reject
              </button>
            </div>
          )}

          {request.status === 'accepted' && (
            <div className="session">
              <h3>Session Details</h3>

              <p>
                <strong>Date:</strong> 20 September 2026
              </p>

              <p>
                <strong>Time:</strong> 6:00 PM
              </p>

              <p>
                <strong>Skill:</strong> {request.skillName}
              </p>

              <button onClick={() => updateStatus(request.id, 'completed')}>
                Mark Session Completed
              </button>
            </div>
          )}

          {request.status === 'completed' && !feedbackSubmitted && (
            <div className="feedback">
              <h3>Give Feedback</h3>

              <label>
                <strong>Rating:</strong>
              </label>

              <br />

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Very Poor</option>
              </select>

              <br />
              <br />

              <label>
                <strong>Comment:</strong>
              </label>

              <br />

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback"
                rows="4"
              />

              <br />

              <button onClick={submitFeedback}>
                Submit Feedback
              </button>
            </div>
          )}

          {feedbackSubmitted && (
            <div className="feedback">
              <h3>Feedback Submitted ⭐</h3>
              <p>
                <strong>Rating:</strong> {rating}/5
              </p>
              <p>
                <strong>Comment:</strong> {comment}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Requests