var reserve = [];

function Trajectoire(e,f){
        reserve = [];
        console.log('Raw distance: '+e);
    var t = Math.round(e*rapport);
    var aff = "<button class='ledecl' title='Open action menu' onclick='OuvrirModal()'>details</button><br>";
        aff += '<b><u>Total distance:</u> '+t+' km</b>';
    var a = KtoT(t);
        aff += "<br><br><u><b>Land:</b></u><ul>";
        a.terrestre.forEach(function(ee){
            aff += '<li>'+ee+'</li>';
        });
        aff += '</ul><br><u><b>Navigation:</b></u><ul>';
        a.navigation.forEach(function(ee){
            aff += '<li>'+ee+'</li>';
        });   
        aff += '</ul>'
    $("#sortie").html(aff);

    // Modal
    var aff2 = "";
    for (let i = 1; i <= f.length; i++) {
        var t2 = Math.round(f[i-1]*rapport);
        aff2 += '<div><b>Segment '+i+':</b> '+t2+' km';
        var a2 = KtoT(t2);
        aff2 += "<br><u><b>Land:</b></u><ul>";
        var ii = 0;
        a2.terrestre.forEach(function(ee){
            aff2 += '<li><input type="radio" onchange="Updated()" name="section_'+i+'" value="'+ii+'">'+ee+'</li>';
            ii += Number(1);
        });
        aff2 += '</ul><u><b>Navigation:</b></u><ul>';
        a2.navigation.forEach(function(ee){
            aff2 += '<li><input type="radio" onchange="Updated()" name="section_'+i+'" value="'+ii+'">'+ee+'</li>';
            ii += Number(1);
        });
        aff2 += "</ul></div><hr>"
    } 
    $("#modal-body").html(aff2);
}

function KtoT(km){
    var pied =	Number(km)/20;// 20km per day
    var piedE = Math.round((Number(pied) - Number(Math.floor(pied)))*24);
    var cheval = Number(km)/40;	// 40km per day
    var chevalE = Math.round((Number(cheval) - Number(Math.floor(cheval)))*24);
    var chevalL = Number(km)/65;	// 65km per day : light load
    var chevalEL = Math.round((Number(chevalL) - Number(Math.floor(chevalL)))*24);
    
    var boeuf =	Number(km)/15;//
    var boeufE = Math.round((Number(boeuf) - Number(Math.floor(boeuf)))*24);
    var caravane =	Number(km)/30;// 30km per day
    var caravaneE = Math.round((Number(caravane) - Number(Math.floor(caravane)))*24);		
    var caleche =	Number(km)/35;// 35km per day
    var calecheE = Math.round((Number(caleche) - Number(Math.floor(caleche)))*24);

    var eau_douce =	Number(km)/50;// 50km per day
    var eau_douceE = Math.round((Number(eau_douce) - Number(Math.floor(eau_douce)))*24);
    var haute_mer =	Number(km)/100;// 100km per day
    var haute_merE = Math.round((Number(haute_mer) - Number(Math.floor(haute_mer)))*24);

        var terrestre = ["<b>Ox:</b> "+Math.floor(boeuf)+" day(s) and "+boeufE+" hour(s).","<b>On foot:</b> "+Math.floor(pied)+" day(s) and "+piedE+" hour(s).","<b>Caravan | Cart:</b> "+Math.floor(caravane)+" day(s) and "+caravaneE+" hour(s).","<b>On horseback</b> (<i>moderate load</i>): "+Math.floor(cheval)+" day(s) and "+chevalE+" hour(s).","<b>Carriage:</b> "+Math.floor(caleche)+" day(s) and "+calecheE+" hour(s).","<b>On horseback</b> (<i>light load</i>): "+Math.floor(chevalL)+" day(s) and "+chevalEL+" hour(s)."];
        var navigation = ["<b>Inland water:</b> "+Math.floor(eau_douce)+" day(s) and "+eau_douceE+" hour(s).","<b>Open sea:</b> "+Math.floor(haute_mer)+" day(s) and "+haute_merE+" hour(s)."];
    reserve.push([
        boeuf,pied,caravane,cheval,caleche,chevalL,eau_douce,haute_mer
    ])
    return {terrestre,navigation};
}

function OuvrirModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    window.onclick = function(event) {
        if(modal.style.display == "block"){
            if (event.target == modal) {
                return modal.style.display = "none";
            }
        }else{return;}
    }
}
function FermerModal(){document.getElementById("myModal").style.display = "none";}

function Updated(){
    var R = [];
    for (let i = 1; i < reserve.length; i++){
        var a = $('input[name=section_'+i+']:checked').val()
        if(a != undefined){R.push(a);}else{return;}
    }
    if(R.length == Number(reserve.length-1)){
        var N = 0;
        for(let i=0;i<R.length;i++){
            N += Number(reserve[i+1][R[i]]);
        }
        var h = Math.round((Number(N) - Number(Math.floor(N)))*24);
        $("#modal-fin").html("<b><u>Total time:</u> "+Math.floor(N)+" day(s) and "+h+" hour(s).</b>");
    }else{return;}
}

function modificateur_aff(e){
	var type = e.alt;
	if(type == "close"){
		e.alt = "open";
		e.style.transform = "rotate(0deg)";
        document.getElementById('modificateur').style.display = 'block';
	}else{
		e.alt = "close";
		e.style.transform = "rotate(180deg)";
        document.getElementById('modificateur').style.display = 'none';
	}
}

function ModifTrajet(e){
    var aff = '';
    if(e==0 || e==undefined){return $('#R_mt').html('');}else if(e>0){
        aff = "<i style='color:green'>This is a bonus.</i>";
    }else{
        aff = "<i style='color:red'>This is a penalty.</i>";
    }
    var R = [];
    for (let i = 1; i < reserve.length; i++){
        var a = $('input[name=section_'+i+']:checked').val()
        if(a != undefined){R.push(a);}else{return $('#R_mt').html("You must choose a transport mode for each segment.");}
    }
    var m = (100-Number(e))/100;
    if(R.length == Number(reserve.length-1)){
        var N = 0;
        aff += '<ul>';
        for(let i=0;i<R.length;i++){
            var a = Number(reserve[i+1][R[i]])*m;
            var h = Math.round((Number(a) - Number(Math.floor(a)))*24);
            N += Number(a);
            aff += "<li><b>Segment "+Number(i+1)+":</b> "+Math.floor(a)+" day(s) and "+h+" hour(s).</li>";
        }
        aff += '</ul>';
        var h = Math.round((Number(N) - Number(Math.floor(N)))*24);
        aff += "<b><u>Total time:</u> "+Math.floor(N)+" day(s) and "+h+" hour(s).</b>";
    }else{
        aff = "You must choose a transport mode for each segment.";
    }
        aff += "<hr>";
    $('#R_mt').html(aff);
}

$(document).ready(function(){
    $('body').append("<div id='montrer' alt='open'>☰</div>");
    $('#montrer').on('click', function(){
        var e = $('#montrer').attr('alt');
        if(e == 'open'){
            document.getElementById('sidebar').style.display = 'block';
            $('#montrer').attr('alt','close');
            
        }else{
            document.getElementById('sidebar').style.display = 'none';
            $('#montrer').attr('alt','open');
        }
    });
});