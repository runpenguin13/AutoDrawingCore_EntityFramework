using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    public partial class XEquipmentItem
    {
        public int? VesselIdx { get; set; }
        public int? ComponentIdx { get; set; }
        public double? Qty { get; set; }
        [Key]
        public int EquipmentItemIdx { get; set; }        

        [ForeignKey("VesselIdx")]
        public XVessel Vessel { get; set; }
    }
}
