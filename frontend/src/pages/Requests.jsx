import { useState } from 'react'

function Requests() {
  const [requests, setRequests] = useState([
    {
      id: 'R001',
      learnerName: 'Rahul',
      mentorName: 'You',
      skillName: 'React',
      message: 'I would like to learn React from you.',
      status: 'pending',
      date: '2026-09-19',
      direction: 'received',
    },
  ])

  const [sessions, setSessions] = useState([])

  const [skillName, setSkillName] = useState('')
  const [message, setMessage] = useState('')

  const [sessionDate, setSessionDate] = useState('')
  const [sessionTime, setSessionTime] = useState('')

  const [rating, setRating] = useState(0)
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

  const sendRequest = () => {
    if (skillName === '' || message === '') {
      return
    }

    const newRequest = {
      id: `R00${requests.length + 1}`,
      learnerName: 'You',
      mentorName: 'A mentor',
      skillName: skillName,
      message: message,
      status: 'pending',
      date: '2026-09-19',
      direction: 'sent',
    }

    setRequests((currentRequests) => [
      ...currentRequests,
      newRequest,
    ])

    setSkillName('')
    setMessage('')
  }

  const scheduleSession = (request) => {
    if (sessionDate === '' || sessionTime === '') {
      return
    }

    const newSession = {
      id: `SS00${sessions.length + 1}`,
      requestId: request.id,
      skillName: request.skillName,
      learnerName: request.learnerName,
      mentorName: request.mentorName,
      date: sessionDate,
      time: sessionTime,
      status: 'scheduled',
    }

    setSessions((currentSessions) => [
      ...currentSessions,
      newSession,
    ])

    setSessionDate('')
    setSessionTime('')
  }

  const completeSession = (sessionId) => {
    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === sessionId
          ? { ...session, status: 'completed' }
          : session
      )
    )
  }

  const submitFeedback = () => {
    setFeedbackSubmitted(true)
  }

  const handleStarClick = (event, star) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const clickPosition = event.clientX - rect.left

    if (clickPosition < rect.width / 2) {
      setRating(star - 0.5)
    } else {
      setRating(star)
    }
  }

  const getStarColor = (star) => {
    if (rating >= star) {
      return '#f5b301'
    }

    if (rating === star - 0.5) {
      return 'url(#halfStar)'
    }

    return '#d1d5db'
  }

  return (
    <div>
      <h2>Campus Skill Exchange</h2>

      {/* SEND REQUEST */}

      <div className="request-card">
        <h3>Send Learning Request</h3>

        <label>
          <strong>Skill:</strong>
        </label>

        <br />

        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder="Enter skill you want to learn"
        />

        <br />
        <br />

        <label>
          <strong>Message:</strong>
        </label>

        <br />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your request message"
          rows="4"
        />

        <br />

        <button onClick={sendRequest}>
          Send Request
        </button>
      </div>

      {/* SENT REQUESTS */}

      <h2>My Sent Requests</h2>

      {requests
        .filter((request) => request.direction === 'sent')
        .map((request) => (
          <div className="request-card" key={request.id}>
            <h3>{request.skillName}</h3>

            <p>
              <strong>To:</strong> {request.mentorName}
            </p>

            <p>{request.message}</p>

            <p>
              <strong>Status:</strong>{' '}
              <span className="status">
                {request.status}
              </span>
            </p>

            <p>
              <strong>Requested on:</strong>{' '}
              {request.date}
            </p>
          </div>
        ))}

      {/* RECEIVED REQUESTS */}

      <h2>Received Requests</h2>

      {requests
        .filter((request) => request.direction === 'received')
        .map((request) => (
          <div className="request-card" key={request.id}>
            <h3>{request.skillName}</h3>

            <p>
              <strong>From:</strong> {request.learnerName}
            </p>

            <p>{request.message}</p>

            <p>
              <strong>Status:</strong>{' '}
              <span className="status">
                {request.status}
              </span>
            </p>

            <p>
              <strong>Requested on:</strong>{' '}
              {request.date}
            </p>

            {request.status === 'pending' && (
              <div>
                <button
                  onClick={() =>
                    updateStatus(
                      request.id,
                      'accepted'
                    )
                  }
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      request.id,
                      'rejected'
                    )
                  }
                >
                  Reject
                </button>
              </div>
            )}

            {request.status === 'accepted' && (
              <div className="session">
                <h3>Schedule Session</h3>

                <label>
                  <strong>Date:</strong>
                </label>

                <br />

                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) =>
                    setSessionDate(e.target.value)
                  }
                />

                <br />
                <br />

                <label>
                  <strong>Time:</strong>
                </label>

                <br />

                <input
                  type="time"
                  value={sessionTime}
                  onChange={(e) =>
                    setSessionTime(e.target.value)
                  }
                />

                <br />

                <button
                  onClick={() =>
                    scheduleSession(request)
                  }
                >
                  Schedule Session
                </button>
              </div>
            )}
          </div>
        ))}

      {/* UPCOMING SESSIONS */}

      <h2>Upcoming Sessions</h2>

      {sessions
        .filter(
          (session) => session.status === 'scheduled'
        )
        .map((session) => (
          <div className="request-card" key={session.id}>
            <h3>{session.skillName}</h3>

            <p>
              <strong>Student:</strong>{' '}
              {session.learnerName}
            </p>

            <p>
              <strong>Date:</strong> {session.date}
            </p>

            <p>
              <strong>Time:</strong> {session.time}
            </p>

            <p>
              <strong>Status:</strong>{' '}
              <span className="status">
                Scheduled
              </span>
            </p>

            <button
              onClick={() =>
                completeSession(session.id)
              }
            >
              Mark Session Completed
            </button>
          </div>
        ))}

      {/* FEEDBACK */}

      {sessions.some(
        (session) => session.status === 'completed'
      ) &&
        !feedbackSubmitted && (
          <div className="request-card">
            <h2>Give Feedback</h2>

            <label>
              <strong>Rating:</strong>
            </label>

            <div className="star-rating">
              <svg
                width="0"
                height="0"
                style={{ position: 'absolute' }}
              >
                <defs>
                  <linearGradient
                    id="halfStar"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="50%"
                      stopColor="#f5b301"
                    />
                    <stop
                      offset="50%"
                      stopColor="#d1d5db"
                    />
                  </linearGradient>
                </defs>
              </svg>

              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="rating-star"
                  viewBox="0 0 24 24"
                  onClick={(event) =>
                    handleStarClick(event, star)
                  }
                >
                  <polygon
                    points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
                    fill={getStarColor(star)}
                  />
                </svg>
              ))}
            </div>

            <p className="rating-number">
              {rating}/5
            </p>

            <label>
              <strong>Comment:</strong>
            </label>

            <br />

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
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
        <div className="request-card">
          <h2>Feedback Submitted</h2>

          <p>
            <strong>Rating:</strong> {rating}/5
          </p>

          <p>
            <strong>Comment:</strong> {comment}
          </p>
        </div>
      )}
    </div>
  )
}

export default Requests