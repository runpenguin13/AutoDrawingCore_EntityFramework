using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("RelationShape", Schema = "Drawing")]
    public partial class RelationShape
    {
        public int Id { get; set; }
        public int? ShapeId { get; set; }
        public int? ReShapeId { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Method { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Value { get; set; }

        [ForeignKey("ReShapeId")]
        public Shape ReShape { get; set; }
        [ForeignKey("ShapeId")]
        public Shape Shape { get; set; }
    }
}
