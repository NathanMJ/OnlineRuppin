namespace WebApplication1.Models
{
    public class Section
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Product> Products { get; set; } = new List<Product>();
        public string Img { get; set; }
    }
}
