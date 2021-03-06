<?php
/**
 * Pimcore
 *
 * This source file is subject to the GNU General Public License version 3 (GPLv3)
 * For the full copyright and license information, please view the LICENSE.md and gpl-3.0.txt
 * files that are distributed with this source code.
 *
 * @copyright  Copyright (c) 2009-2016 pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GNU General Public License version 3 (GPLv3)
 */

namespace Pimcore\Controller\Action\Admin;

use Pimcore\Controller\Action\Admin;
use Pimcore\Config;

class Reports extends Admin
{

    /**
     * @var
     */
    public $conf;

    /**
     *
     */
    public function init()
    {
        parent::init();
    }

    /**
     * @return \Zend_Config
     */
    public function getConfig()
    {
        return Config::getReportConfig();
    }
}
