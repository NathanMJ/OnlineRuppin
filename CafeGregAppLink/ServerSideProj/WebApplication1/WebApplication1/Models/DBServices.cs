
using System.Data;
using System.Data.SqlClient;

namespace WebApplication1.Models
{
    public static class DBServices
    {
        //static string conStr = @"Data Source=DESKTOP-AOOLDVU;Initial Catalog=appLinkAppCafeGreg;Integrated Security=True;";

        //static string conStr = @"Data Source=DESKTOP-0IB6OU2\SQLEXPRESS;Initial Catalog=appLinkAppCafeGreg;Integrated Security=True;";
        static string conStr = "workstation id=AppLinkDB.mssql.somee.com;packet size=4096;user id=Nathan_SQLLogin_1;pwd=94q8ria4x2;data source=AppLinkDB.mssql.somee.com;persist security info=False;initial catalog=AppLinkDB;TrustServerCertificate=True";

        public static void DisconnectCustomer(string customerId)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand("DisconnectCustomer", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@customerId", customerId);

                con.Open();
                cmd.ExecuteNonQuery(); // Pas besoin de récupérer de résultat
            }
        }


        public static List<Customer> GetAllCustomersByTableId(int tableId)
        {
            List<Customer> customers = new List<Customer>();

            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand("GetAllCustomersByTableId", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@tableId", tableId);

                con.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        customers.Add(new Customer
                        {
                            ID = reader["customer_id"].ToString(),
                            Contact = reader["Contact"].ToString(),
                            FirstName = reader["FirstName"].ToString()
                        });
                    }
                }
            }

            return customers;
        }


        public static void RegisterCustomer(string id, string contact, string firstName, int tableId)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand("RegisterCustomer", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id", id);
                cmd.Parameters.AddWithValue("@contact", contact);
                cmd.Parameters.AddWithValue("@firstName", firstName);
                cmd.Parameters.AddWithValue("@tableId", tableId);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public static Customer LoginCustomer(string id, int tableId)
        {
            Customer customer = null;

            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand("LoginCustomer", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id", id);
                cmd.Parameters.AddWithValue("@tableId", tableId);

                con.Open();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        customer = new Customer
                        {
                            ID = reader["ID"].ToString(),
                            Contact = reader["Contact"].ToString(),
                            FirstName = reader["FirstName"].ToString()
                        };
                    }
                }
            }

            return customer ?? throw new Exception("Login failed.");
        }

        public static int ChangeOrderStatus(int orderId, int newStatus)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand("changeOrderStatus", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@orderId", orderId);
                cmd.Parameters.AddWithValue("@newStatus", newStatus);

                con.Open();
                object result = cmd.ExecuteScalar();

                if (result != null && int.TryParse(result.ToString(), out int updatedStatus))
                {
                    return updatedStatus;
                }
                else
                {
                    throw new Exception("Order not found or status not updated.");
                }
            }
        }


        public static void CancelOrder(int orderId)
        {
            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand("cancelOrder", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@orderId", orderId);

                con.Open();
                cmd.ExecuteNonQuery();
            }
        }

        public static int OrderProductById(int productId, int tableId)
        {
            int newOrderId = 0;

            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand("orderProductById", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@productId", productId);
                cmd.Parameters.AddWithValue("@tableId", tableId);

                con.Open();
                object result = cmd.ExecuteScalar(); // On récupère le SCOPE_IDENTITY()

                if (result != null && int.TryParse(result.ToString(), out int orderId))
                {
                    newOrderId = orderId;
                }
            }

            return newOrderId;
        }

        public static int? GetTableIdWithLinkId(int linkId)
        {
            int? tableId = null;

            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand("getTableIdWithLinkId", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@linkId", linkId);

                con.Open();
                var result = cmd.ExecuteScalar();
                if (result != null && result != DBNull.Value)
                {
                    tableId = Convert.ToInt32(result);
                }
            }

            return tableId;
        }
        public static List<OrderDTO> GetOrdersByTableId(int tableId)
        {
            var orders = new List<OrderDTO>();

            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand("getOrdersWithTableId", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@tableId", tableId);

                con.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        orders.Add(new OrderDTO
                        {
                            OrderId = (int)reader["order_id"],
                            ProductId = (int)reader["product_id"],
                            ProductName = reader["product_name"].ToString(),
                            Price = (decimal)reader["price"],
                            Img = reader["img"].ToString(),
                            StatusName = reader["status_name"].ToString(),
                            BackgroundColor = reader["backgroundColor"].ToString(),
                            Color = reader["color"].ToString()
                        });
                    }
                }
            }

            return orders;
        }

        public static List<Section> GetAllSectionsWithProducts()
        {
            var sections = new List<Section>();

            using (SqlConnection con = new SqlConnection(conStr))
            {
                con.Open();

                // 1. Récupérer toutes les sections via la procédure stockée getSections
                using (SqlCommand cmd = new SqlCommand("getSections", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var section = new Section
                            {
                                Id = (int)reader["id"],
                                Name = (string)reader["name"],
                                Img = reader["img"] as string
                            };
                            sections.Add(section);
                        }
                    }
                }

                // 2. Pour chaque section, récupérer les produits avec getProductsBySectionId (proc stockée)
                foreach (var section in sections)
                {
                    using (SqlCommand cmd = new SqlCommand("getProductsBySectionId", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@section_id", section.Id);

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var product = new Product
                                {
                                    Id = (int)reader["id"],
                                    Name = (string)reader["name"],
                                    Price = (decimal)reader["price"],
                                    Img = reader["img"] as string
                                };
                                section.Products.Add(product);
                            }
                        }
                    }
                }
            }

            return sections;
        }

        public static List<Product> SearchProductsByName(string searchText)
        {
            var products = new List<Product>();

            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand cmd = new SqlCommand("SearchProductsByName", con))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@searchText", searchText);

                con.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        products.Add(new Product
                        {
                            Id = (int)reader["id"],
                            Name = reader["name"].ToString(),
                            Price = (decimal)reader["price"],
                            Img = reader["img"].ToString()
                            // Ajoute d'autres propriétés si besoin
                        });
                    }
                }
            }

            return products;
        }

    }
}
