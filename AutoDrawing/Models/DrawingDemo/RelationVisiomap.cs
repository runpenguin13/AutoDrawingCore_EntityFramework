using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("RelationVisiomap", Schema = "Drawing")]
    public partial class RelationVisiomap
    {
        public int Id { get; set; }
        public int? VisiomapId { get; set; }
        [Column(TypeName = "nvarchar(20)")]
        public string Method { get; set; }
        public string Value { get; set; }
        public string VariantIds { get; set; }
        public int? IntEquipmentId { get; set; }
        public int? IntProductId { get; set; }
        public int? ReLayerId { get; set; }
        [Column(TypeName = "nvarchar(7)")]
        public string ReLayerValue { get; set; }

        [ForeignKey("VisiomapId")]
        public VisioMap VisioMap { get; set; }
    }
}
