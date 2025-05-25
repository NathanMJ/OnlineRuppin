using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {

        [HttpGet]
        public IActionResult Get() {
            return Ok(777); 
        }  

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        
        public IActionResult Post([FromBody] UserDTO userdto)
        {
            try
            {
                if (userdto == null)
                    return BadRequest();

                User user = DBServices.Login(userdto);

                if (user != null)
                {
                    return Ok(user);
                }
                else
                {
                    return NoContent();
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
