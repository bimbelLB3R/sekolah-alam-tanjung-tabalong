// lib/api-client.js
/**
 * Event Management API Client
 * Wrapper untuk semua API calls ke backend
 */

export class EventAPI {
  static baseUrl = '/api/allevents';

  // ==================== EVENTS ====================
  
  /**
   * Get all events dengan optional filters
   * @param {Object} filters - { status, search, year }
   * @returns {Promise<Object>}
   */
  static async getAll(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const url = params.toString() 
        ? `${this.baseUrl}?${params}` 
        : this.baseUrl;
      
      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get single event by ID
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  static async getById(id) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`);
      return res.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create new event
   * @param {Object} data - Event data
   * @returns {Promise<Object>}
   */
  static async create(data) {
    try {
      const res = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    } catch (error) {
      console.error('Error creating event:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update event
   * @param {number|string} id
   * @param {Object} data - Updated event data
   * @returns {Promise<Object>}
   */
  static async update(id, data) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete event
   * @param {number|string} id
   * @returns {Promise<Object>}
   */
  static async delete(id) {
    try {
      const res = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });
      return res.json();
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== COMMITTEE ====================

  /**
   * Get all committee members for an event
   * @param {number|string} eventId
   * @returns {Promise<Object>}
   */
  static async getCommittee(eventId) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/committee`);
      return res.json();
    } catch (error) {
      console.error('Error fetching committee:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add committee member
   * @param {number|string} eventId
   * @param {Object} data - Committee member data
   * @returns {Promise<Object>}
   */
  static async addCommitteeMember(eventId, data) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/committee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    } catch (error) {
      console.error('Error adding committee member:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update committee member
   * @param {number|string} eventId
   * @param {number|string} committeeId
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
  static async updateCommitteeMember(eventId, committeeId, data) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/committee`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ committee_id: committeeId, ...data })
      });
      return res.json();
    } catch (error) {
      console.error('Error updating committee member:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete committee member
   * @param {number|string} eventId
   * @param {number|string} committeeId
   * @returns {Promise<Object>}
   */
  static async deleteCommitteeMember(eventId, committeeId) {
    try {
      const res = await fetch(
        `${this.baseUrl}/${eventId}/committee?committee_id=${committeeId}`,
        { method: 'DELETE' }
      );
      return res.json();
    } catch (error) {
      console.error('Error deleting committee member:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reorder committee members (for drag & drop)
   * @param {number|string} eventId
   * @param {Array} orders - Array of {id, sort_order}
   * @returns {Promise<Object>}
   */
  static async reorderCommittee(eventId, orders) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/committee/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      });
      return res.json();
    } catch (error) {
      console.error('Error reordering committee:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== TODOS ====================

  /**
   * Get all todos for an event
   * @param {number|string} eventId
   * @param {Object} filters - { status, priority }
   * @returns {Promise<Object>}
   */
  static async getTodos(eventId, filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const url = params.toString()
        ? `${this.baseUrl}/${eventId}/todos?${params}`
        : `${this.baseUrl}/${eventId}/todos`;

      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.error('Error fetching todos:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add todo
   * @param {number|string} eventId
   * @param {Object} data - Todo data
   * @returns {Promise<Object>}
   */
  static async addTodo(eventId, data) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    } catch (error) {
      console.error('Error adding todo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update todo (full update)
   * @param {number|string} eventId
   * @param {number|string} todoId
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
  static async updateTodo(eventId, todoId, data) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/todos`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo_id: todoId, ...data })
      });
      return res.json();
    } catch (error) {
      console.error('Error updating todo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update todo status (quick update)
   * @param {number|string} eventId
   * @param {number|string} todoId
   * @param {string} status - pending|in_progress|completed|cancelled
   * @returns {Promise<Object>}
   */
  static async updateTodoStatus(eventId, todoId, status) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/todos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo_id: todoId, status })
      });
      return res.json();
    } catch (error) {
      console.error('Error updating todo status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete todo
   * @param {number|string} eventId
   * @param {number|string} todoId
   * @returns {Promise<Object>}
   */
  static async deleteTodo(eventId, todoId) {
    try {
      const res = await fetch(
        `${this.baseUrl}/${eventId}/todos?todo_id=${todoId}`,
        { method: 'DELETE' }
      );
      return res.json();
    } catch (error) {
      console.error('Error deleting todo:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== RUNDOWN ====================

  /**
   * Get all rundown items for an event
   * @param {number|string} eventId
   * @returns {Promise<Object>}
   */
  static async getRundown(eventId) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/rundown`);
      return res.json();
    } catch (error) {
      console.error('Error fetching rundown:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add rundown item
   * @param {number|string} eventId
   * @param {Object} data - Rundown item data
   * @returns {Promise<Object>}
   */
  static async addRundownItem(eventId, data) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/rundown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    } catch (error) {
      console.error('Error adding rundown item:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update rundown item
   * @param {number|string} eventId
   * @param {number|string} rundownId
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
  static async updateRundownItem(eventId, rundownId, data) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/rundown`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rundown_id: rundownId, ...data })
      });
      return res.json();
    } catch (error) {
      console.error('Error updating rundown item:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete rundown item
   * @param {number|string} eventId
   * @param {number|string} rundownId
   * @returns {Promise<Object>}
   */
  static async deleteRundownItem(eventId, rundownId) {
    try {
      const res = await fetch(
        `${this.baseUrl}/${eventId}/rundown?rundown_id=${rundownId}`,
        { method: 'DELETE' }
      );
      return res.json();
    } catch (error) {
      console.error('Error deleting rundown item:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reorder rundown items (for drag & drop)
   * @param {number|string} eventId
   * @param {Array} orders - Array of {id, sort_order}
   * @returns {Promise<Object>}
   */
  static async reorderRundown(eventId, orders) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/rundown`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      });
      return res.json();
    } catch (error) {
      console.error('Error reordering rundown:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== BUDGET =====

  /**
   * Get budget items for an event with summary
   * @param {number|string} eventId
   * @param {Object} filters - { type: 'pemasukan' | 'pengeluaran' }
   * @returns {Promise<Object>} { success, data, summary }
   */
  static async getBudget(eventId, filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const url = params.toString()
        ? `${this.baseUrl}/${eventId}/budget?${params}`
        : `${this.baseUrl}/${eventId}/budget`;
      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.error('Error fetching budget:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add budget item (pemasukan/pengeluaran)
   * @param {number|string} eventId
   * @param {Object} data - Budget item data
   * @returns {Promise<Object>}
   */
  static async addBudgetItem(eventId, data) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    } catch (error) {
      console.error('Error adding budget item:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update budget item
   * @param {number|string} eventId
   * @param {number|string} budgetId
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
  static async updateBudgetItem(eventId, budgetId, data) {
    try {
      const res = await fetch(`${this.baseUrl}/${eventId}/budget`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget_id: budgetId, ...data })
      });
      return res.json();
    } catch (error) {
      console.error('Error updating budget item:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete budget item
   * @param {number|string} eventId
   * @param {number|string} budgetId
   * @returns {Promise<Object>}
   */
  static async deleteBudgetItem(eventId, budgetId) {
    try {
      const res = await fetch(
        `${this.baseUrl}/${eventId}/budget?budget_id=${budgetId}`,
        { method: 'DELETE' }
      );
      return res.json();
    } catch (error) {
      console.error('Error deleting budget item:', error);
      return { success: false, error: error.message };
    }
  }
}


// ==================== USER API ====================
export class UserAPI {
  static baseUrl = '/api/users/autocomplete/';

  /**
   * Get all users (limited by default)
   * @param {number} limit - Max results (default: 10)
   * @returns {Promise<Object>}
   */
  static async getAll(limit = 20) {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      const url = `${this.baseUrl}?${params}`;
      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Search users by name or email
   * @param {string} search - Search query
   * @param {number} limit - Max results (default: 10)
   * @returns {Promise<Object>}
   */
  static async search(search = '', limit = 10) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('limit', limit.toString());
      const url = `${this.baseUrl}?${params}`;
      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.error('Error searching users:', error);
      return { success: false, error: error.message };
    }
  }
}

// ==================== BUDGET MONITORING API ====================
export class BudgetMonitoringAPI {
  static baseUrl = '/api/allevents/monitoring';

  /**
   * Get budget monitoring data untuk Kepala Sekolah
   * @param {Object} filters - { year, status }
   * @returns {Promise<Object>}
   */
  static async getMonitoring(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const url = params.toString()
        ? `${this.baseUrl}?${params}`
        : this.baseUrl;

      const res = await fetch(url);
      return res.json();
    } catch (error) {
      console.error('Error fetching budget monitoring:', error);
      return { success: false, error: error.message };
    }
  }
}




// ==================== USAGE EXAMPLES ====================

/**
 * Example usage in React components:
 * 
 * import { EventAPI } from '@/lib/api-client';
 * import { toast } from 'sonner';
 * 
 * // Get all events
 * const result = await EventAPI.getAll({ status: 'planning' });
 * if (result.success) {
 *   setEvents(result.data);
 * }
 * 
 * // Create event
 * const newEvent = await EventAPI.create({
 *   name: 'Event Baru',
 *   start_date: '2025-06-01',
 *   end_date: '2025-06-02',
 *   status: 'planning'
 * });
 * if (newEvent.success) {
 *   toast.success('Event berhasil dibuat');
 * }
 * 
 * // Add committee member
 * await EventAPI.addCommitteeMember(eventId, {
 *   position_name: 'Ketua',
 *   person_name: 'John Doe'
 * });
 * 
 * // Update todo status (quick)
 * await EventAPI.updateTodoStatus(eventId, todoId, 'completed');
 */