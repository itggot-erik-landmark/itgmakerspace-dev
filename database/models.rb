class Categories < DatabaseHandler::Table
  table_name "categories"
  attribute "id", "Integer", :not_null => true, :primary_key => true
  attribute "name", "VARCHAR(50)"

  init_table

  def self.get_categories
    categories = []
    Categories.all(:order => [:name, :asc]).each do |category|
      if category.id != 0
        categories << {:category_id => category.id, :category_name => category.name}
      end
    end
    return categories
  end

  def self.get_category_list
    categories = []
    Categories.all(:order => [:name, :asc]).each do |category|
      if category.id != 0
        categories[category.id] = category.name
      end
    end
    return categories
  end
end

class Loan_Items < DatabaseHandler::Table
  ACTIVE = 1
  INACTIVE = 0

  table_name "loan_items"

  attribute "id", "Integer", :primary_key => true, :auto_increment => true, :not_null => true
  attribute "loan_id", "Integer"
  attribute "status", "Integer"
  attribute "quantity", "Integer"
  attribute "item_id", "Integer"

  init_table
end

class Loans < DatabaseHandler::Table
  ACTIVE = 1
  INACTIVE = 0

  table_name "loans"
  attribute "id", "Integer", :primary_key => true, :auto_increment => true, :not_null => true
  attribute "user_id", "Integer"
  attribute "status", "Integer"
  attribute "date_loaned", "VARCHAR(30)"

  belongs_to :items, Loan_Items, :id, :loan_id

  init_table
end

class Order_Items < DatabaseHandler::Table
  ACTIVE = 1
  INACTIVE = 0

  table_name "order_items"

  attribute "id", "Integer", :primary_key => true, :auto_increment => true, :not_null => true
  attribute "order_id", "Integer"
  attribute "user_id", "Integer"
  attribute "status", "Integer", :default => ACTIVE
  attribute "quantity", "Integer"
  attribute "name", "VARCHAR(150)"
  attribute "price", "Real"
  attribute "url", "VARCHAR(1000)"

  init_table
end

class Orders < DatabaseHandler::Table
  ACTIVE = 1
  INACTIVE = 0

  table_name "orders"
  attribute "id", "Integer", :primary_key => true, :auto_increment => true, :not_null => true
  attribute "status", "Integer", :default => ACTIVE
  attribute "date_created", "VARCHAR(30)"
  attribute "date_due_by", "VARCHAR(30)"
  attribute "name", "VARCHAR(30)"
  attribute "description", "VARCHAR(16384)"

  belongs_to :items, Order_Items, :id, :order_id

  def self.get_total_price(id)
    total_price = 0.0
    order = Orders.first(:id => id){{:include => "items"}}
    unless order.items.nil?
      order.items.each do |item|
        total_price += item.price.to_f * item.quantity.to_f if item.status == Order_Items::ACTIVE
      end
    end
    total_price
  end

  init_table
end

class Users < DatabaseHandler::Table
  table_name "users"
  attribute "id", "Integer", :primary_key => true, :auto_increment => true, :not_null => true
  attribute "name", "VARCHAR(100)"
  attribute "email", "VARCHAR(100)"
  attribute "password", "VARCHAR(65)"
  attribute "security_key", "VARCHAR(100)"
  attribute "birth_date", "VARCHAR(30)"
  attribute "permission_level", "Integer"

  belongs_to :loans, Loans, :id, :user_id

  init_table
end

class Inventory < DatabaseHandler::Table
  table_name "inventory_items"

  attribute "id", "Integer", :primary_key => true, :auto_increment => true, :not_null => true
  attribute "name", "VARCHAR(50)"
  attribute "barcode", "VARCHAR(10)"
  attribute "description", "VARCHAR(16384)"
  attribute "quantity", "Integer"
  attribute "category", "Integer"
  attribute "stock_quantity", "Integer"
  attribute "specs", "VARCHAR(16384)"

  init_table

  def self.get_inventory(params:)
    inventory_hash = {}

    if !params.nil? && params.length > 0
      if params[:search_term] != nil && params[:search_term] != ''
        inventory_hash[:name] = {:like => params[:search_term]}
      end
      if params[:category] != nil && params[:category].to_i <= Categories.max(:id) && params[:category].to_i > 0
        inventory_hash[:category] = params[:category]
      end
      if params[:sort_after] != nil && (params[:sort_after] == "name_asc" || params[:sort_after] == "name_desc" || params[:sort_after] == "quantity_asc" || params[:sort_after] == "quantity_desc")
        order_type = params[:sort_after][0..params[:sort_after].index('_') - 1]
        order_dir = params[:sort_after][params[:sort_after].index('_') + 1..-1]
        inventory_hash[:order] = [order_type.to_sym, order_dir.to_sym]
      end
    end

    Inventory.all(inventory_hash)
  end

  def self.get_inventory_names
    categories = []
    Categories.all.each do |category|
      categories << category.name
    end
    inventory_item_names = []
    Inventory.all(:order => [:name, :asc]).each do |item|
      inventory_item_names << [item.name, categories[item.category]]
    end
    inventory_item_names
  end

  def self.update_quantity_from_loans(item_id)
    new_q = 0
    Loan_Items.all(:item_id => item_id, :status => Loan_Items::ACTIVE).each do |loan_item|
      new_q += loan_item.quantity
    end

    item = Inventory.first(:id => item_id)
    item.update({:quantity => item.stock_quantity - new_q})
  end

  def self.update_inventory_items
    all_loans = Loans.all(:status => Loans::ACTIVE){{:include => "items"}}
    if all_loans.length >= 1
      all_loans.each do |loan|
        loan.items.each do |item|
          inv_item = Inventory.first(:id => item.item_id)
          unless inv_item.update(:quantity => (inv_item.stock_quantity - item.quantity))
            puts "Error in updating inventory!! Item_id = #{item.item_id}, Loan_id = #{loan.id}"
          end
        end
      end
    else
      Inventory.all.each do |item|
        item.update(:quantity => item.stock_quantity)
      end
    end
  end

  def self.delete_inventory_item(item_id:, quantity:)
    item = Inventory.first(:id => item_id)
    if item != nil
      item.update(:quantity => (item.quantity.to_i - quantity.to_i))
    else
      false
    end
  end

  def self.add_inventory_item(item_id:, quantity:)
    item = Inventory.first(:id => item_id)
    if item != nil
      item.update(:quantity => (item.quantity.to_i + quantity.to_i))
    else
      false
    end
  end
end

class Logs < DatabaseHandler::Table
  ERROR_LOG = 1
  NORMAL_LOG = 0

  table_name "logs"

  attribute "id", "Integer", :primary_key => true, :auto_increment => true, :not_null => true
  attribute "type", "Integer"
  attribute "code", "Integer"
  attribute "description", "VARCHAR(200)"
  attribute "stacktrace", "VARCHAR(16384)"
  attribute "ip", "VARCHAR(20)"
  attribute "path", "VARCHAR(200)"
  attribute "message", "VARCHAR(200)"
  attribute "datetime", "VARCHAR(20)"

  init_table
end