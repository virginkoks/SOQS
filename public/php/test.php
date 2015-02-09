<?php



define ('CDIR', $_SERVER['DOCUMENT_ROOT'] . '/ank/dfr3GR$f00kmFE1_CC');
	
require_once CDIR . '/equipment/functions.php';
		
$DB = new DBWORKER('localhost', 'jrc workflow', 'utf8', 'jrc_member', 'J8LTaqqHDrpd6TWd');

print_r($_SERVER);

//$test = $DB -> prep('SELECT `q0`, count(`q0`) AS c0 FROM `1_out_statistic` GROUP BY `q0` HAVING count(*) >= ALL(SELECT count(*) FROM `1_out_statistic` GROUP BY `q0`)') -> fetch(PDO :: FETCH_ASSOC);

//preg_match('/^' . $_GET['a'] . '\[(.+)\]|' . $_GET['a'] . '$/', $_GET['b'], $recmatch);
//
//print_r($recmatch);
				
//$DB -> prep('UPDATE `1_out_statistic` SET `q1` = `q1` + 1 WHERE ' . implode(' || ', $stat) . ' LIMIT ' . count($a_stat));

//for ($i = 0; $i < 50; $i ++) {
//	
//	$hash = md5(generator(5));
//	
//	$DB -> prep('INSERT INTO `spamlist` (`hash`) VALUES ("' . $hash . '")');
//	
//	echo $hash . '<br>';
//	
//}

//foreach ($_GET as $key => $val) {
//		
//		//preg_match('/(?<=a)\d{1,3}/', $val, $postdata);
//		
//		//print_r($postdata);
//		 //echo '<br>' . var_dump(is_numeric($key)).'-'.gettype($key).'<br>';
//		
//	}
//
//$condition_aa = $DB -> prep('SELECT `placement`, `transition` FROM `2_questions` WHERE `id` = 1 LIMIT 1') -> fetch(PDO :: FETCH_ASSOC);

//$placement_rule = unserialize($condition_aa['placement']);

//echo implode(' OR ', $stat);

//$r = array(1, 3, 1);
//
//$condition = false;
//
//if (count($_GET['c']) >= $r[0] && count($_GET['c']) <= $r[1]) {
//
//	foreach ($_GET['c'] as $k => $v) {
//			
//		if ((string)$k != $v) { 
//		
//			if (strlen($v) > 260) {
//		
//				$condition = false;
//				
//				break;
//		
//			} else {
//				
//				$r[2] --;
//				
//				if ($r[2] < 0) {
//					
//					$condition = false;
//					
//					break;
//					
//				} else $condition = true;
//				
//			}
//			
//		} else $condition = true;
//		
//	}
//
//}
//
//var_dump($condition); echo $r[2];

//echo count($_GET['c']);

//$test = $DB -> prep('SHOW TABLE STATUS FROM `ank` LIKE "1_out"') -> fetch(PDO :: FETCH_ASSOC);
//
//echo $test['Auto_increment'];

//$t = array(8 => array('type' => array('image/gpeg', 'image/jpeg'), 'size' => array(3145728, 3145728)), 9 => array('type' => array('audio/mpeg'), 'size' => array(3145728)));
//
//echo json_encode($t);

//$t = json_encode(array('1' => array('test', 'test'), '2' => array('user', 'user')));

//file_put_contents('rrr.txt', $t);

?>