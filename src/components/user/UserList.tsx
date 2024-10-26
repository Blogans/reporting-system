import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  ListGroup,
  Button,
  Modal,
  Alert,
} from "react-bootstrap";
import { User, Venue } from "../../types/types";
import { useApi } from "../../util/apiUtil";
import AddUser from "./AddUser";
import EditUser from "./EditUser";
import { usePermissions } from "../../util/usePermissions";
import SearchBar from "../shared/SearchBar";
import ItemListAndAdd from "../shared/ItemListAndAdd";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { fetchWithAuth } = useApi();
  const [error, setError] = useState<string | null>(null);
  const { hasPermission } = usePermissions();
  const [userVenues, setUserVenues] = useState<Venue[]>([]);
  const [showVenuesModal, setShowVenuesModal] = useState(false);

  const getVenueName = (venue: Venue) => venue.name;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await fetchWithAuth("/api/users");
      setUsers(data);
    } catch (err) {
      setError("Error fetching users");
    }
  };

  const handleAddUser = async (newUser: {
    username: string;
    password: string;
    email: string;
    role: string;
  }) => {
    try {
      const response = await fetchWithAuth("/api/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });

      const addedUser = response.user;
      setUsers([...users, addedUser]);
      setShowAddModal(false);
    } catch (err) {
      setError("Error adding user");
    }
  };

  const handleEditUser = async (updatedUser: Partial<User>) => {
    try {
      const response = await fetchWithAuth(`/api/users/${updatedUser._id}`, {
        method: "PUT",
        body: JSON.stringify(updatedUser),
      });

      const editedUser = response.user;
      setUsers(
        users.map((user) => (user._id === editedUser._id ? editedUser : user))
      );
      setShowEditModal(false);
      console.log(editedUser);

      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error("Error editing user:", err);
      // The error message from the server will be in err.message
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await fetchWithAuth(`/api/users/${userId}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      setError("Error deleting user");
    }
  };

  const handleDeleteVenueFromUser = async (venueId: string) => {
    if (!selectedUser) return;
    try {
      await fetchWithAuth(`/api/users/${selectedUser._id}/venues/${venueId}`, {
        method: "DELETE",
      });
      setUserVenues(userVenues.filter((venue) => venue._id !== venueId));
    } catch (error) {
      setError("Error removing venue from user");
    }
  };

  const renderVenue = (venue: Venue) => (
    <div>
      {venue.name} - {venue.address}
    </div>
  );

  const fetchVenues = useCallback(async () => {
    const data = await fetchWithAuth("/api/venues");
    return data;
  }, [fetchWithAuth]);

  const addVenueToUser = useCallback(
    async (userId: string, venueId: string) => {
      try {
        await fetchWithAuth(`/api/users/${userId}/venues/${venueId}`, {
          method: "POST",
        });
        setError(null);
      } catch (error) {
        setError("Error adding venue to user");
      }
    },
    [fetchWithAuth]
  );

  const handleShowVenues = async (user: User) => {
    setSelectedUser(user);
    try {
      const data = await fetchWithAuth(`/api/users/${user._id}/venues`);
      setUserVenues(data);
      setShowVenuesModal(true);
    } catch (err) {
      setError("Error fetching user venues");
    }
  };

  const handleVenueAdded = () => {
    if (selectedUser) {
      handleShowVenues(selectedUser);
    }
  };

  const filterUsers = useCallback(
    (user: User, searchTerm: string) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    []
  );

  const handleFilter = useCallback((filteredItems: User[]) => {
    setFilteredUsers(filteredItems);
  }, []);

  return (
    <Container className="mt-4">
      <h2>Users</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <SearchBar<User>
        items={users}
        onFilter={handleFilter}
        filterFunction={filterUsers}
        placeholder="Search users by username or email"
      />

      <ListGroup>
        {filteredUsers.length === 0 && <p>No users found</p>}
        {filteredUsers.map((user) => (
          <ListGroup.Item
            key={user._id}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h5>{user.username}</h5>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
              <Button onClick={() => handleShowVenues(user)}>
                Manage Venues
              </Button>
            </div>
            <div>
              <Button
                variant="info"
                className="me-2"
                onClick={() => {
                  setSelectedUser(user);
                  setShowEditModal(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {hasPermission("MANAGE_USERS") && (
        <Button
          className="mt-3"
          variant="primary"
          onClick={() => setShowAddModal(true)}
        >
          Add New User
        </Button>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddUser onUserAdded={handleAddUser} />
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <EditUser user={selectedUser} onUserEdited={handleEditUser} />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showVenuesModal} onHide={() => setShowVenuesModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Venues for {selectedUser?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <ItemListAndAdd<Venue>
              parentId={selectedUser._id}
              items={userVenues}
              onItemAdded={handleVenueAdded}
              onDeleteItem={handleDeleteVenueFromUser}
              fetchItems={fetchVenues}
              addItemToParent={addVenueToUser}
              itemType="Venue"
              parentType="User"
              getItemName={getVenueName}
              renderItem={renderVenue}
              canDelete={hasPermission("MANAGE_USERS")}
              canAdd={hasPermission("MANAGE_USERS")}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserList;
