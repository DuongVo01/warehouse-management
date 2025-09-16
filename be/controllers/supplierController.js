const Supplier = require('../models/Supplier');
const { sequelize } = require('../config/database-sqlite');

const supplierController = {
  // Lấy danh sách nhà cung cấp
  getSuppliers: async (req, res) => {
    try {
      const suppliers = await Supplier.findAll({
        order: [['CreatedAt', 'DESC']]
      });
      
      res.json({
        success: true,
        data: suppliers
      });
    } catch (error) {
      console.error('Error getting suppliers:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách nhà cung cấp'
      });
    }
  },

  // Tạo nhà cung cấp mới
  createSupplier: async (req, res) => {
    try {
      const { Name, Address, Phone, Email, TaxCode } = req.body;
      
      if (!Name) {
        return res.status(400).json({
          success: false,
          message: 'Tên nhà cung cấp là bắt buộc'
        });
      }

      // Tạo mã NCC tự động
      const lastSupplier = await Supplier.findOne({
        order: [['SupplierID', 'DESC']]
      });
      const nextId = lastSupplier ? lastSupplier.SupplierID + 1 : 1;
      const supplierCode = `NCC${String(nextId).padStart(4, '0')}`;

      const supplier = await Supplier.create({
        SupplierCode: supplierCode,
        Name,
        Address,
        Phone,
        Email,
        TaxCode
      });

      res.status(201).json({
        success: true,
        data: supplier,
        message: 'Tạo nhà cung cấp thành công'
      });
    } catch (error) {
      console.error('Error creating supplier:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi tạo nhà cung cấp'
      });
    }
  },

  // Cập nhật nhà cung cấp
  updateSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      const { Name, Address, Phone, Email, TaxCode } = req.body;

      if (!Name) {
        return res.status(400).json({
          success: false,
          message: 'Tên nhà cung cấp là bắt buộc'
        });
      }

      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhà cung cấp'
        });
      }

      // Không cho phép sửa mã NCC
      await supplier.update({
        Name,
        Address,
        Phone,
        Email,
        TaxCode
      });

      res.json({
        success: true,
        data: supplier,
        message: 'Cập nhật nhà cung cấp thành công'
      });
    } catch (error) {
      console.error('Error updating supplier:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi cập nhật nhà cung cấp'
      });
    }
  },

  // Xóa nhà cung cấp
  deleteSupplier: async (req, res) => {
    try {
      const { id } = req.params;
      const { force } = req.query; // Thêm tham số force để xóa bắt buộc

      const supplier = await Supplier.findByPk(id);
      if (!supplier) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy nhà cung cấp'
        });
      }

      // Kiểm tra xem có giao dịch nào tham chiếu đến nhà cung cấp này không
      const [transactionCount] = await sequelize.query(
        'SELECT COUNT(*) as count FROM inventory_transactions WHERE supplier_i_d = ?',
        { replacements: [id] }
      );

      if (transactionCount[0].count > 0) {
        if (force === 'true') {
          // Xóa tất cả giao dịch liên quan trước
          await sequelize.query(
            'DELETE FROM inventory_transactions WHERE supplier_i_d = ?',
            { replacements: [id] }
          );
        } else {
          return res.status(400).json({
            success: false,
            message: `Không thể xóa nhà cung cấp này vì có ${transactionCount[0].count} giao dịch liên quan`,
            canForceDelete: true
          });
        }
      }

      await supplier.destroy();

      res.json({
        success: true,
        message: 'Xóa nhà cung cấp thành công'
      });
    } catch (error) {
      console.error('Error deleting supplier:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi xóa nhà cung cấp'
      });
    }
  }
};

module.exports = supplierController;