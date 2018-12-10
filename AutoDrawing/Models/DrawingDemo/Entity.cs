using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("Entity", Schema = "Partners")]
    public partial class Entity
    {
        public int Id { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Name { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Code { get; set; }
        public int? CompanyIdx { get; set; }
        public DateTime? Date { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string User { get; set; }
    }
}
