namespace WebApplication1.Models
{
    public class OrderDTO
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }           
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public string Img { get; set; }              
        public string StatusName { get; set; }
        public string BackgroundColor { get; set; }
        public string Color { get; set; }
    }


}
