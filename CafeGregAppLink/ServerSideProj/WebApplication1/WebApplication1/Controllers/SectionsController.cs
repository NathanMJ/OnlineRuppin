using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SectionsController : ControllerBase
    {
        [HttpGet("total-sections")]
        public IActionResult GetSectionsWithProducts()
        {
            try
            {
                var sections = DBServices.GetAllSectionsWithProducts();
                return Ok(sections);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
