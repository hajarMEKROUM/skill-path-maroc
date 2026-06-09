import React, { useEffect, useState } from 'react';
import { Search, Filter, ShieldAlert, Download } from 'lucide-react';
import useUsersStore from '../../store/usersStore';
import UsersTable from '../../components/admin/UsersTable';
import UserDetailsModal from '../../components/admin/UserDetailsModal';
import CreateUserModal from '../../components/admin/CreateUserModal';

const UsersManagement = () => {
  const { users, isLoading, fetchUsers, filters, setFilters, openModal } = useUsersStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    setFilters({ search: e.target.value });
  };

  const handleRoleFilter = (e) => {
    setFilters({ role: e.target.value });
  };

  const handleActionClick = (user) => {
    // Open user details/actions modal
    openModal('details', user);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Users Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform members, roles, and moderation statuses.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 font-medium text-sm transition-colors">
            Ajouter un utilisateur
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 font-medium text-sm transition-colors hidden sm:flex">
            <Download size={16} className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Advanced Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            placeholder="Search by name, email, or ID..."
            value={filters.search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select 
              className="block w-full pl-10 pr-10 py-2.5 text-base border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-xl cursor-pointer"
              value={filters.role}
              onChange={handleRoleFilter}
            >
              <option value="">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="instructor">Instructors</option>
              <option value="freelancer">Freelancers</option>
              <option value="enterprise">Enterprises</option>
              <option value="student">Students</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enterprise DataGrid */}
      <UsersTable 
        users={users} 
        isLoading={isLoading} 
        onActionClick={handleActionClick} 
      />

      {/* Render Modals outside the layout flow */}
      <UserDetailsModal />
      <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={fetchUsers} />

    </div>
  );
};

export default UsersManagement;
