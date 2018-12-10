using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    public partial class XVessel
    {
        public XVessel()
        {
            
        }

        [Key]
        public int VesselIdx { get; set; }
        public string HullCode { get; set; }
        public string HullName { get; set; }
        public string VesselCode { get; set; }
        public string Remark { get; set; }
        public string Kind { get; set; }
        public string Flag { get; set; }
        public string Class { get; set; }
        public string JrcSalesNo { get; set; }
        public string CallSign { get; set; }
        public string Mmsi { get; set; }
        public string FirstVessel { get; set; }
        public string ImoNo { get; set; }
        public string ProjectOrSeries { get; set; }
        public string OfficialNo { get; set; }
        public string GrossTonnage { get; set; }
        public string PortOfRegistry { get; set; }
        public string Notation { get; set; }
        public string GoogleDoc { get; set; }
        public string State { get; set; }
        public DateTime? RDate { get; set; }
        public string RUser { get; set; }
        public DateTime? EDate { get; set; }
        public string EUser { get; set; }
        public int? YardCompanyIdx { get; set; }
        public int? OwnerCompanyIdx { get; set; }
        public int? DesignCompanyIdx { get; set; }
        public string Tag { get; set; }
        public string BuiltYear { get; set; }
        public string Class2 { get; set; }
        public string Notation2 { get; set; }
        public string Size { get; set; }
        public string Survey { get; set; }
        public string Notation3 { get; set; }
        public string Survey2 { get; set; }
        public string Notation4 { get; set; }
        public DateTime? KeelLaying { get; set; }
        public DateTime? SeaTrial { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string Gmdss { get; set; }
        public string Rms { get; set; }
        public string Bam { get; set; }

        
        public ICollection<XEquipmentItem> XEquipmentItems { get; set; }
        public ICollection<XService> XServices { get; set; }
    }
}
