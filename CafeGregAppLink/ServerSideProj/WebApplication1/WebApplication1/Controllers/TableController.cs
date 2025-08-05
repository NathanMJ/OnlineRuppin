using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TablesController : ControllerBase
    {
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [HttpGet("tableId/{linkId}")]
        public IActionResult GetTableId(int linkId)
        {
            try
            {
                int? tableId = DBServices.GetTableIdWithLinkId(linkId);
                if (tableId.HasValue)
                    return Ok(tableId);
                else
                    return NoContent(); 
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }

}
