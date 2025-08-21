
import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Modal, Button, Overlay, Popover } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPopover, setShowPopover] = useState(false);
    const [selectedNotif, setSelectedNotif] = useState(null);

    const bellRef = useRef(null);

    // Fetch both rejection + nomination notifications
    const fetchNotifications = async () => {
        try {
            const [rejRes, nomRes] = await Promise.all([
                axiosInstance.get('/training/notification/rejections/'),
                axiosInstance.get('/training/notification/nominations/')
            ]);

            const rejectionNotifs = rejRes.data.map(n => ({
                ...n,
                type: 'rejection'
            }));
            const nominationNotifs = nomRes.data.map(n => ({
                ...n,
                type: 'nomination'
            }));

            const merged = [...rejectionNotifs, ...nominationNotifs].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );

            setNotifications(merged);
            setUnreadCount(merged.length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleBellClick = () => {
        setShowPopover((prev) => !prev);
    };

    const handleNotificationClick = (notif) => {
        setSelectedNotif(notif);
        setShowPopover(false);
    };

    const closeDetailModal = async () => {
        if (selectedNotif) {
            try {
                if (selectedNotif.type === "rejection") {
                    await axiosInstance.delete(`/training/notification/rejections/${selectedNotif.id}/delete/`);
                } else {
                    await axiosInstance.post(`/training/notification/nominations/${selectedNotif.id}/read/`);
                }

                setNotifications((prev) => prev.filter((n) => n.id !== selectedNotif.id));
                setUnreadCount((prev) => Math.max(prev - 1, 0));
            } catch (err) {
                console.error("Failed to update notification:", err);
            }
        }

        setSelectedNotif(null);
        setTimeout(() => setShowPopover(true), 300);
    };

    return (
        <>
            {/* Bell Icon with Badge */}
            <div ref={bellRef} onClick={handleBellClick} style={{ position: 'relative', cursor: 'pointer' }}>
                <FaBell className="text-white fs-4" />
                {unreadCount > 0 && (
                    <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                        {unreadCount}
                    </span>
                )}
            </div>

            {/* Popover beneath Bell */}
            <Overlay target={bellRef.current} show={showPopover} placement="bottom-end" rootClose onHide={() => setShowPopover(false)}>
                <Popover className="shadow border-0" style={{ width: '300px' }}>
                    <Popover.Header as="h5" className="bg-dark text-white">Notifications</Popover.Header>
                    <Popover.Body>
                        {notifications.length === 0 ? (
                            <p className="text-muted text-center">No notifications yet.</p>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {notifications.map((notif) => (
                                    <li
                                        key={`${notif.type}-${notif.id}`}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleNotificationClick(notif)}
                                    >
                                        <strong>{notif.training_name}</strong><br />
                                        {notif.type === "rejection" ? (
                                            <small className="text-danger">Rejected by {notif.coordinator_name}</small>
                                        ) : (
                                            <small className="text-success">Nomination finalized</small>
                                        )}
                                        <br />
                                        <small className="text-muted">{new Date(notif.created_at).toLocaleString()}</small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Popover.Body>
                </Popover>
            </Overlay>

            {/* Detail Modal */}
            <Modal show={!!selectedNotif} onHide={closeDetailModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedNotif?.type === "rejection" ? "Rejection Details" : "Nomination Details"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedNotif && (
                        <>
                            <p><strong>Training:</strong> {selectedNotif.training_name}</p>
                            {selectedNotif.type === "rejection" ? (
                                <>
                                    <p><strong>Rejected By:</strong> {selectedNotif.coordinator_name}</p>
                                    <p><strong>Reason:</strong></p>
                                    <p>{selectedNotif.reason}</p>
                                </>
                            ) : (
                                <p className="text-success">🎉 Your nomination for this training has been finalized!</p>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDetailModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default NotificationBell;

