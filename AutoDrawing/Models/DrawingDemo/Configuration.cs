using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("Configuration", Schema = "Drawing")]
    public partial class Configuration
    {
        public int Id { get; set; }
        public int? DwgEquipmentId { get; set; }
        public int? VariantId { get; set; }
        public int? Quantity { get; set; }
        [Column(TypeName = "nvarchar(5)")]
        public string State { get; set; }

        public virtual DrawingEquipment DwgEquipment { get; set; }
        public virtual Variant Variant { get; set; }
    }
}
