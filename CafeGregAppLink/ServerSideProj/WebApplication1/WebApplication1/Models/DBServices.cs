
using System.Data;
using System.Data.SqlClient;

namespace WebApplication1.Models
{
    public static class DBServices
    {
        //static string conStr = @"Data Source=DESKTOP-0IB6OU2\SQLEXPRESS;Initial Catalog=appLinkAppCafeGreg;Integrated Security=True;";
        static string conStr = "workstation id=DBLinkApp.mssql.somee.com;packet size=4096;user id=Nathan_SQLLogin_1;pwd=94q8ria4x2;data source=DBLinkApp.mssql.somee.com;persist security info=False;initial catalog=DBLinkApp;TrustServerCertificate=True";

        public static Table GetTableById(int tableId)
        {
            Table table = null;
            string query = $"SELECT id, link_id FROM tables WHERE id = {tableId}";

            using (SqlConnection con = new SqlConnection(conStr))
            using (SqlCommand comm = new SqlCommand(query, con))
            {
                con.Open();

                using (SqlDataReader reader = comm.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        table = new Table()
                        {
                            Id = (int)reader["id"],
                            LinkId = (int)reader["link_id"]
                        };
                    }
                }
            }
            return table;
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
                cmd.Parameters.AddWithValue("@table_id", tableId);

                con.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        orders.Add(new OrderDTO
                        {
                            OrderId = (int)reader["order_id"],
                            ProductName = reader["product_name"].ToString(),
                            Price = (decimal)reader["price"],
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


        /// <summary>
        /// 
        /// </summary>
        /// <param name="userdto">userdto suppose to contain the pass and mail</param>
        /// <returns>will return the user iwth all its props name ismadmin</returns>

        //internal static User Login(UserDTO userdto)
        //{
        //    return ExcQUser(
        //        $" SELECT * " +
        //        $" FROM TBUsers " +
        //        $" WHERE mail='{userdto.Mail}' and password='{userdto.Password}'");
        //}
    }
}
